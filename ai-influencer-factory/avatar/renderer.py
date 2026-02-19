"""
Renderer
========
Final composition step. Merges the avatar video + speech audio, scales to
target resolution and aspect ratio, optionally applies RIFE 60fps frame
interpolation, and burns subtitles.

Supported aspect ratios:
  9:16  — TikTok, Instagram Reels, YouTube Shorts   (1080×1920)
  16:9  — YouTube landscape, LinkedIn               (1920×1080)
  1:1   — Instagram square feed                     (1080×1080)
  4:5   — Instagram portrait feed                   (1080×1350)
  21:9  — Cinematic ultra-wide                      (2560×1080)

Output: output/rendered/{job_id}_final.mp4
"""

from __future__ import annotations

import os
import subprocess
from dataclasses import dataclass, field
from enum import Enum


# ---------------------------------------------------------------------------
# Enums & constants
# ---------------------------------------------------------------------------

class AspectRatio(str, Enum):
    VERTICAL   = "9:16"
    HORIZONTAL = "16:9"
    SQUARE     = "1:1"
    PORTRAIT   = "4:5"
    CINEMATIC  = "21:9"


ASPECT_DIMENSIONS: dict[AspectRatio, tuple[int, int]] = {
    AspectRatio.VERTICAL:   (1080, 1920),
    AspectRatio.HORIZONTAL: (1920, 1080),
    AspectRatio.SQUARE:     (1080, 1080),
    AspectRatio.PORTRAIT:   (1080, 1350),
    AspectRatio.CINEMATIC:  (2560, 1080),
}


# ---------------------------------------------------------------------------
# Config
# ---------------------------------------------------------------------------

@dataclass
class RenderConfig:
    """
    Controls all rendering parameters.

    Defaults produce a 1080p vertical 30fps H.264 MP4 — optimal for TikTok.
    """
    aspect_ratio: AspectRatio = AspectRatio.VERTICAL
    fps: int = 30
    crf: int = 18                        # H.264 quality (18 = near-lossless)
    preset: str = "slow"                 # FFmpeg encoding preset
    use_rife: bool = False               # Enable RIFE frame interpolation
    target_fps: int = 60                 # Output fps when use_rife=True
    add_captions: bool = False
    caption_file: str | None = None      # Path to .srt or .vtt file
    background_music: str | None = None  # Optional background track
    music_volume: float = 0.08           # BG music relative to speech


# ---------------------------------------------------------------------------
# Renderer
# ---------------------------------------------------------------------------

class Renderer:
    """
    Composites video + audio into a broadcast-ready MP4.

    Usage:
        r = Renderer()
        config = RenderConfig(aspect_ratio=AspectRatio.HORIZONTAL, fps=30)
        final = r.render(
            video_path="output/body/job_001_merged.mp4",
            audio_path="output/audio/job_001_speech.wav",
            job_id="job_001",
            config=config,
        )
    """

    def __init__(
        self,
        output_dir: str = "output/rendered",
        rife_path: str = "models/RIFE",
    ):
        self.output_dir = output_dir
        self.rife_path = rife_path
        os.makedirs(output_dir, exist_ok=True)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def render(
        self,
        video_path: str,
        audio_path: str,
        job_id: str,
        config: RenderConfig | None = None,
    ) -> str:
        """
        Produce the final rendered video.

        Args:
            video_path: Input video (body-merged or face-only).
            audio_path: Primary speech audio (WAV).
            job_id:     Artifact identifier for file naming.
            config:     RenderConfig; defaults applied if None.

        Returns:
            Path to final MP4 at output/rendered/{job_id}_final.mp4.
        """
        if config is None:
            config = RenderConfig()

        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Video not found: {video_path}")
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Audio not found: {audio_path}")

        width, height = ASPECT_DIMENSIONS[config.aspect_ratio]
        composed = os.path.join(self.output_dir, f"{job_id}_composed.mp4")
        self._compose(video_path, audio_path, composed, width, height, config)

        current = composed

        # Optional RIFE frame interpolation for 60fps output
        if config.use_rife:
            rife_script = os.path.join(self.rife_path, "inference_video.py")
            if os.path.exists(rife_script):
                rife_out = os.path.join(self.output_dir, f"{job_id}_rife.mp4")
                self._apply_rife(current, rife_out, config.target_fps)
                current = rife_out
            else:
                print(
                    f"[Renderer] RIFE not found at '{self.rife_path}'. "
                    "Skipping frame interpolation."
                )

        # Optional caption burn-in
        if config.add_captions and config.caption_file:
            if os.path.exists(config.caption_file):
                captioned = os.path.join(self.output_dir, f"{job_id}_captioned.mp4")
                self._burn_captions(current, config.caption_file, captioned)
                current = captioned
            else:
                print(
                    f"[Renderer] Caption file not found: {config.caption_file}. "
                    "Skipping caption burn-in."
                )

        final = os.path.join(self.output_dir, f"{job_id}_final.mp4")
        os.replace(current, final)
        return final

    # ------------------------------------------------------------------
    # Internal steps
    # ------------------------------------------------------------------

    def _compose(
        self,
        video: str,
        audio: str,
        output: str,
        width: int,
        height: int,
        config: RenderConfig,
    ) -> None:
        """Scale, pad, and mux video + audio (+ optional background music)."""
        scale_filter = (
            f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
            f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:black"
        )

        inputs = ["-i", video, "-i", audio]
        audio_map = ["-map", "0:v:0", "-map", "1:a:0"]
        audio_filter_args: list[str] = []

        if config.background_music and os.path.exists(config.background_music):
            inputs += ["-i", config.background_music]
            vol = max(0.01, min(1.0, config.music_volume))
            speech_vol = round(1.0 - vol, 2)
            audio_filter_args = [
                "-filter_complex",
                f"[1:a]volume={speech_vol}[speech];[2:a]volume={vol}[bg];"
                "[speech][bg]amix=inputs=2:duration=first[aout]",
                "-map", "0:v:0",
                "-map", "[aout]",
            ]
            audio_map = []  # overridden by filter_complex

        cmd = (
            ["ffmpeg", "-y"]
            + inputs
            + ["-vf", scale_filter, "-r", str(config.fps)]
            + (audio_map if not audio_filter_args else [])
            + audio_filter_args
            + [
                "-c:v", "libx264",
                "-preset", config.preset,
                "-crf", str(config.crf),
                "-c:a", "aac",
                "-b:a", "192k",
                "-shortest",
                output,
            ]
        )

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"Composition failed:\n{result.stderr}")

    def _apply_rife(self, input_path: str, output_path: str, target_fps: int) -> None:
        """Run RIFE optical-flow frame interpolation."""
        script = os.path.join(self.rife_path, "inference_video.py")
        cmd = [
            "python", script,
            "--video", input_path,
            "--output", output_path,
            "--fps", str(target_fps),
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"RIFE interpolation failed:\n{result.stderr}")

    def _burn_captions(self, video: str, srt_path: str, output: str) -> None:
        """Burn .srt subtitles into the video stream."""
        # Escape colons in Windows paths for FFmpeg
        safe_srt = srt_path.replace("\\", "/").replace(":", "\\:")
        vf = (
            f"subtitles={safe_srt}:force_style='"
            "FontName=Arial,FontSize=22,PrimaryColour=&HFFFFFF,"
            "OutlineColour=&H000000,Outline=2,MarginV=40'"
        )
        cmd = [
            "ffmpeg", "-y",
            "-i", video,
            "-vf", vf,
            "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-c:a", "copy",
            output,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"Caption burn-in failed:\n{result.stderr}")
