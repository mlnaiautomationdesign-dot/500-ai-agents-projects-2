"""
Exporter
========
Transcodes and packages the final rendered video for each target platform.

Supported platforms: TikTok, YouTube, Instagram, Twitter/X, LinkedIn

Each platform has a defined spec (resolution, fps, codec, max duration,
audio bitrate). The exporter re-encodes via FFmpeg without re-rendering.

Output files are auto-named:
  {persona_name}_{platform_suffix}_{YYYYMMDD_HHMMSS}.mp4

All exports land in output/exports/.
"""

from __future__ import annotations

import os
import subprocess
from dataclasses import dataclass, field
from datetime import datetime, timezone
from enum import Enum


# ---------------------------------------------------------------------------
# Platform registry
# ---------------------------------------------------------------------------

class Platform(str, Enum):
    TIKTOK    = "tiktok"
    YOUTUBE   = "youtube"
    INSTAGRAM = "instagram"
    TWITTER   = "twitter"
    LINKEDIN  = "linkedin"


# Per-platform encoding specifications
PLATFORM_SPECS: dict[Platform, dict] = {
    Platform.TIKTOK: {
        "width": 1080, "height": 1920, "fps": 30,
        "max_duration": 600,        # 10 minutes
        "crf": 20, "audio_bitrate": "128k",
        "suffix": "tiktok_9x16",
    },
    Platform.YOUTUBE: {
        "width": 1920, "height": 1080, "fps": 30,
        "max_duration": None,       # No hard limit
        "crf": 18, "audio_bitrate": "192k",
        "suffix": "youtube_16x9",
    },
    Platform.INSTAGRAM: {
        "width": 1080, "height": 1920, "fps": 30,
        "max_duration": 90,         # 90 seconds for Reels
        "crf": 20, "audio_bitrate": "128k",
        "suffix": "instagram_9x16",
    },
    Platform.TWITTER: {
        "width": 1280, "height": 720, "fps": 30,
        "max_duration": 140,        # ~2 min 20 sec
        "crf": 22, "audio_bitrate": "128k",
        "suffix": "twitter_16x9",
    },
    Platform.LINKEDIN: {
        "width": 1920, "height": 1080, "fps": 30,
        "max_duration": 600,
        "crf": 18, "audio_bitrate": "192k",
        "suffix": "linkedin_16x9",
    },
}


# ---------------------------------------------------------------------------
# Result model
# ---------------------------------------------------------------------------

@dataclass
class ExportResult:
    platform: Platform
    output_path: str
    file_size_mb: float
    duration_seconds: float
    ready: bool
    warnings: list[str] = field(default_factory=list)


# ---------------------------------------------------------------------------
# Exporter
# ---------------------------------------------------------------------------

class Exporter:
    """
    Transcodes a rendered video for one or more target platforms.

    Usage:
        exp = Exporter()
        results = exp.export(
            video_path="output/rendered/job_001_final.mp4",
            persona_name="Alex Tech",
            platforms=[Platform.TIKTOK, Platform.YOUTUBE],
        )
        exp.print_summary(results)
    """

    def __init__(self, output_dir: str = "output/exports"):
        self.output_dir = output_dir
        os.makedirs(output_dir, exist_ok=True)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def export(
        self,
        video_path: str,
        persona_name: str,
        platforms: list[Platform] | None = None,
    ) -> list[ExportResult]:
        """
        Export a rendered video for each listed platform.

        Args:
            video_path:    Final rendered MP4 from Renderer.
            persona_name:  Used in output file naming.
            platforms:     Target platforms. Defaults to TikTok + YouTube.

        Returns:
            List of ExportResult, one per platform.

        Raises:
            FileNotFoundError: If video_path does not exist.
        """
        if not os.path.exists(video_path):
            raise FileNotFoundError(f"Render not found: {video_path}")

        if platforms is None:
            platforms = [Platform.TIKTOK, Platform.YOUTUBE]

        results: list[ExportResult] = []
        for platform in platforms:
            result = self._export_single(video_path, persona_name, platform)
            results.append(result)
        return results

    def print_summary(self, results: list[ExportResult]) -> None:
        """Print a formatted export summary to stdout."""
        print("\n" + "=" * 54)
        print("  Export Summary")
        print("=" * 54)
        for r in results:
            status = "READY  " if r.ready else "FAILED "
            print(f"  [{status}] {r.platform.value:<12}  {r.output_path}")
            print(f"            Size: {r.file_size_mb:.1f} MB  |  "
                  f"Duration: {r.duration_seconds:.1f}s")
            for w in r.warnings:
                print(f"            WARNING: {w}")
        print("=" * 54 + "\n")

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _export_single(
        self,
        video_path: str,
        persona_name: str,
        platform: Platform,
    ) -> ExportResult:
        spec = PLATFORM_SPECS[platform]
        ts = datetime.now(tz=timezone.utc).strftime("%Y%m%d_%H%M%S")
        safe_name = persona_name.lower().replace(" ", "_")
        filename = f"{safe_name}_{spec['suffix']}_{ts}.mp4"
        output_path = os.path.join(self.output_dir, filename)

        warnings: list[str] = []
        duration = self._probe_duration(video_path)
        max_dur = spec["max_duration"]

        if max_dur and duration > max_dur:
            warnings.append(
                f"Duration {duration:.1f}s exceeds {platform.value} limit "
                f"of {max_dur}s. Video will be trimmed to {max_dur}s."
            )

        self._transcode(video_path, output_path, spec, max_dur)

        file_size_mb = os.path.getsize(output_path) / (1024 * 1024)
        export_duration = min(duration, max_dur) if max_dur else duration

        return ExportResult(
            platform=platform,
            output_path=output_path,
            file_size_mb=round(file_size_mb, 2),
            duration_seconds=round(export_duration, 2),
            ready=True,
            warnings=warnings,
        )

    def _transcode(
        self,
        src: str,
        dst: str,
        spec: dict,
        max_duration: float | None,
    ) -> None:
        w, h = spec["width"], spec["height"]
        vf = (
            f"scale={w}:{h}:force_original_aspect_ratio=decrease,"
            f"pad={w}:{h}:(ow-iw)/2:(oh-ih)/2:black"
        )
        trim: list[str] = ["-t", str(max_duration)] if max_duration else []

        cmd = (
            ["ffmpeg", "-y", "-i", src]
            + trim
            + [
                "-vf", vf,
                "-r", str(spec["fps"]),
                "-c:v", "libx264",
                "-preset", "slow",
                "-crf", str(spec["crf"]),
                "-c:a", "aac",
                "-b:a", spec["audio_bitrate"],
                "-movflags", "+faststart",   # Enables web-optimised streaming
                dst,
            ]
        )

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(
                f"Transcode to {dst} failed:\n{result.stderr}"
            )

    def _probe_duration(self, video_path: str) -> float:
        """Use ffprobe to get video duration in seconds."""
        cmd = [
            "ffprobe", "-v", "error",
            "-select_streams", "v:0",
            "-show_entries", "stream=duration",
            "-of", "default=noprint_wrappers=1:nokey=1",
            video_path,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        try:
            return float(result.stdout.strip())
        except (ValueError, AttributeError):
            return 0.0
