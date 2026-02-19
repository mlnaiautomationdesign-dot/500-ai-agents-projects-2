"""
Voice Generator
===============
Converts script text to speech audio.

Primary provider:  ElevenLabs (high-quality, voice cloning)
Fallback provider: Coqui TTS (self-hosted, no API key needed)
Minimal fallback:  gTTS (Google, internet required, lowest quality)

Output: WAV file written to output/audio/{job_id}_speech.wav
"""

from __future__ import annotations

import os
import subprocess
from pathlib import Path


class VoiceGenerator:
    """
    Text-to-speech synthesis with multi-provider support.

    Usage:
        vg = VoiceGenerator(provider="elevenlabs")
        wav_path = vg.synthesize(
            text="Hey everyone, welcome back!",
            voice_id="21m00Tcm4TlvDq8ikWAM",
            job_id="job_001",
        )
    """

    SUPPORTED_PROVIDERS = ("elevenlabs", "coqui", "gtts")

    def __init__(
        self,
        provider: str = "elevenlabs",
        output_dir: str = "output/audio",
    ):
        if provider not in self.SUPPORTED_PROVIDERS:
            raise ValueError(
                f"provider must be one of {self.SUPPORTED_PROVIDERS}, got '{provider}'"
            )
        self.provider = provider
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def synthesize(
        self,
        text: str,
        voice_id: str,
        job_id: str,
        stability: float = 0.50,
        similarity_boost: float = 0.75,
        speaking_rate: float = 1.0,
        language: str = "en",
    ) -> str:
        """
        Convert text to a WAV audio file.

        Args:
            text:            Script text to synthesize.
            voice_id:        Provider-specific voice identifier.
            job_id:          Unique job ID used for output file naming.
            stability:       ElevenLabs voice stability (0.0–1.0).
            similarity_boost: ElevenLabs similarity boost (0.0–1.0).
            speaking_rate:   Speed multiplier (0.5–2.0); supported by Coqui.
            language:        BCP-47 language tag (used by gTTS).

        Returns:
            Absolute path to the generated WAV file.
        """
        if not text.strip():
            raise ValueError("Cannot synthesize empty text.")

        output_path = os.path.join(self.output_dir, f"{job_id}_speech.wav")

        if self.provider == "elevenlabs":
            self._elevenlabs(text, voice_id, output_path, stability, similarity_boost)
        elif self.provider == "coqui":
            self._coqui(text, voice_id, output_path, speaking_rate)
        elif self.provider == "gtts":
            self._gtts(text, output_path, language)

        if not os.path.exists(output_path):
            raise RuntimeError(
                f"[VoiceGenerator] Provider '{self.provider}' did not produce output at {output_path}"
            )
        return output_path

    # ------------------------------------------------------------------
    # Provider implementations
    # ------------------------------------------------------------------

    def _elevenlabs(
        self,
        text: str,
        voice_id: str,
        output_path: str,
        stability: float,
        similarity_boost: float,
    ) -> None:
        api_key = os.environ.get("ELEVENLABS_API_KEY")
        if not api_key:
            raise EnvironmentError(
                "ELEVENLABS_API_KEY is not set. "
                "Export it or use a different provider."
            )
        try:
            from elevenlabs import ElevenLabs, VoiceSettings
        except ImportError:
            raise ImportError("elevenlabs package not installed. Run: pip install elevenlabs")

        client = ElevenLabs(api_key=api_key)
        audio_stream = client.generate(
            text=text,
            voice=voice_id,
            voice_settings=VoiceSettings(
                stability=stability,
                similarity_boost=similarity_boost,
            ),
            model="eleven_multilingual_v2",
        )
        with open(output_path, "wb") as fh:
            for chunk in audio_stream:
                fh.write(chunk)

    def _coqui(
        self,
        text: str,
        voice_id: str,
        output_path: str,
        speaking_rate: float,
    ) -> None:
        try:
            from TTS.api import TTS
        except ImportError:
            raise ImportError(
                "Coqui TTS not installed. Run: pip install TTS"
            )
        # voice_id can be a full model name like "tts_models/en/ljspeech/tacotron2-DDC"
        # or a short alias; default to a sensible English model if it looks like an alias
        model_name = (
            voice_id
            if "/" in voice_id
            else "tts_models/en/ljspeech/tacotron2-DDC"
        )
        tts = TTS(model_name=model_name, progress_bar=False)
        tts.tts_to_file(text=text, file_path=output_path, speed=speaking_rate)

    def _gtts(self, text: str, output_path: str, language: str) -> None:
        """Minimal fallback using Google TTS. Converts MP3 → WAV via FFmpeg."""
        try:
            from gtts import gTTS
        except ImportError:
            raise ImportError("gTTS not installed. Run: pip install gtts")

        mp3_path = output_path.replace(".wav", "_tmp.mp3")
        gTTS(text=text, lang=language[:2]).save(mp3_path)

        result = subprocess.run(
            ["ffmpeg", "-y", "-i", mp3_path, output_path],
            capture_output=True,
            text=True,
        )
        # Clean up temp file whether or not conversion succeeded
        try:
            os.remove(mp3_path)
        except OSError:
            pass

        if result.returncode != 0:
            raise RuntimeError(f"FFmpeg MP3→WAV conversion failed:\n{result.stderr}")
