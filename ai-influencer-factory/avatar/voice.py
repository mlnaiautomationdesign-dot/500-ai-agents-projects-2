"""
Voice Synthesis — XTTS-v2 (local) + fallback backends
------------------------------------------------------
Primary backend: XTTS-v2 (Coqui TTS) — runs locally, supports multi-language,
accepts a reference WAV for voice cloning.

Fallback backends:
  - OpenAI TTS (cloud, no reference voice)
  - gTTS (free, basic quality)

Output: speech.wav saved to the specified path.
"""

import os
from pathlib import Path
from enum import Enum


class TTSBackend(str, Enum):
    XTTS = "xtts"           # XTTS-v2 local (primary)
    OPENAI = "openai"       # OpenAI TTS cloud
    GTTS = "gtts"           # Google TTS (fallback)


class VoiceSynthesizer:
    """
    Synthesizes speech from text.

    Args:
        backend:        TTS engine to use (default: XTTS-v2 local).
        language:       BCP-47 language code, e.g. "en", "es", "fr", "de", "ja".
        reference_wav:  Path to a reference audio file for XTTS-v2 voice cloning.
                        Required when backend=XTTS. 3–10 seconds of clean speech.
        openai_voice:   Voice ID for OpenAI TTS ("alloy", "echo", "fable", etc.).
    """

    SUPPORTED_LANGUAGES = [
        "en", "es", "fr", "de", "it", "pt", "pl", "tr",
        "ru", "nl", "cs", "ar", "zh", "ja", "ko", "hu",
    ]

    def __init__(
        self,
        backend: TTSBackend = TTSBackend.XTTS,
        language: str = "en",
        reference_wav: str | None = None,
        openai_voice: str = "alloy",
    ) -> None:
        self.backend = backend
        self.language = language
        self.reference_wav = reference_wav
        self.openai_voice = openai_voice
        self._xtts_model = None  # lazy-loaded on first call

    def synthesize(self, text: str, output_path: str = "output/speech.wav") -> str:
        """
        Convert text to speech and save as WAV.

        Args:
            text:        The script text to speak.
            output_path: Destination file path (default: output/speech.wav).

        Returns:
            Absolute path to the generated WAV file.
        """
        if self.backend == TTSBackend.XTTS and self.language not in self.SUPPORTED_LANGUAGES:
            raise ValueError(
                f"Language '{self.language}' not supported by XTTS-v2. "
                f"Supported: {self.SUPPORTED_LANGUAGES}"
            )

        out = Path(output_path)
        out.parent.mkdir(parents=True, exist_ok=True)

        if self.backend == TTSBackend.XTTS:
            return self._synthesize_xtts(text, out)
        elif self.backend == TTSBackend.OPENAI:
            return self._synthesize_openai(text, out)
        elif self.backend == TTSBackend.GTTS:
            return self._synthesize_gtts(text, out)
        else:
            raise ValueError(f"Unsupported TTS backend: {self.backend}")

    # ── XTTS-v2 (local) ──────────────────────────────────────────────────────

    def _load_xtts(self):
        """Lazily load XTTS-v2 model (~2 GB, downloads once to ~/.local/share/tts)."""
        if self._xtts_model is None:
            from TTS.api import TTS  # pip install TTS
            self._xtts_model = TTS("tts_models/multilingual/multi-dataset/xtts_v2")
        return self._xtts_model

    def _synthesize_xtts(self, text: str, out: Path) -> str:
        """
        XTTS-v2 voice cloning from a reference speaker WAV.

        reference_wav must be 3–10 seconds of clean, single-speaker audio.
        The model uses it to extract a speaker embedding for voice cloning.
        """
        if not self.reference_wav:
            raise ValueError(
                "XTTS-v2 requires reference_wav for voice cloning. "
                "Provide a 3–10s clean WAV of the target speaker."
            )
        if not Path(self.reference_wav).exists():
            raise FileNotFoundError(f"Reference WAV not found: {self.reference_wav}")

        wav_out = out.with_suffix(".wav")
        tts = self._load_xtts()
        tts.tts_to_file(
            text=text,
            speaker_wav=self.reference_wav,
            language=self.language,
            file_path=str(wav_out),
        )
        return str(wav_out.resolve())

    # ── OpenAI TTS ───────────────────────────────────────────────────────────

    def _synthesize_openai(self, text: str, out: Path) -> str:
        import openai
        client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        wav_out = out.with_suffix(".wav")
        response = client.audio.speech.create(
            model="tts-1-hd",
            voice=self.openai_voice,
            input=text,
            response_format="wav",
        )
        response.stream_to_file(str(wav_out))
        return str(wav_out.resolve())

    # ── gTTS (free fallback) ─────────────────────────────────────────────────

    def _synthesize_gtts(self, text: str, out: Path) -> str:
        from gtts import gTTS
        import subprocess

        mp3_out = out.with_suffix(".mp3")
        wav_out = out.with_suffix(".wav")

        tts = gTTS(text=text, lang=self.language)
        tts.save(str(mp3_out))

        # Convert mp3 → wav via ffmpeg if available
        try:
            subprocess.run(
                ["ffmpeg", "-y", "-i", str(mp3_out), str(wav_out)],
                check=True, capture_output=True,
            )
            mp3_out.unlink(missing_ok=True)
            return str(wav_out.resolve())
        except (subprocess.CalledProcessError, FileNotFoundError):
            # ffmpeg not available — return mp3
            return str(mp3_out.resolve())
