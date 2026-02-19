"""
Avatar Renderer
---------------
Final composition stage:
  - Merges audio + video to 1080p output
  - Optional 60fps upscaling via RIFE interpolation
  - Multi aspect ratio export: 9:16 (TikTok/Reels), 16:9 (YouTube), 1:1 (Instagram)

Output files are written to /output/<persona_name>/ with auto-generated names.
The /output/ directory is NEVER deleted or cleared automatically.
"""

import subprocess
from datetime import datetime
from pathlib import Path
from dataclasses import dataclass, field
from enum import Enum


class AspectRatio(str, Enum):
    PORTRAIT = "9:16"    # TikTok, Instagram Reels, YouTube Shorts
    LANDSCAPE = "16:9"   # YouTube, Twitter video
    SQUARE = "1:1"       # Instagram feed


# Resolution targets for 1080p per aspect ratio
RESOLUTION_MAP: dict[AspectRatio, tuple[int, int]] = {
    AspectRatio.PORTRAIT:  (1080, 1920),
    AspectRatio.LANDSCAPE: (1920, 1080),
    AspectRatio.SQUARE:    (1080, 1080),
}


@dataclass
class RenderConfig:
    aspect_ratios: list[AspectRatio] = field(
        default_factory=lambda: [AspectRatio.PORTRAIT, AspectRatio.LANDSCAPE]
    )
    fps: int = 30                  # base output framerate
    enable_rife: bool = False      # set True to upscale to 60fps via RIFE
    rife_model_dir: str = "models/RIFE"
    crf: int = 18                  # H.264 quality: lower = better (18 = high quality)
    audio_bitrate: str = "192k"
    output_dir: str = "output"


class AvatarRenderer:
    """
    Composites audio + video into platform-ready output files.

    Workflow:
      1. Receive the face/body video and the speech WAV
      2. Mux audio + video to 1080p for each target aspect ratio
      3. Optionally apply RIFE frame interpolation for 60fps output
      4. Save with auto-generated filenames (persona + timestamp + ratio)
    """

    def __init__(self, config: RenderConfig | None = None) -> None:
        self.config = config or RenderConfig()

    def render(
        self,
        video_path: str,
        audio_path: str,
        persona_name: str,
    ) -> dict[str, str]:
        """
        Render the final video for all configured aspect ratios.

        Args:
            video_path:    Path to the animated video (face or body merge).
            audio_path:    Path to the speech WAV.
            persona_name:  Used for output file naming.

        Returns:
            dict mapping AspectRatio value → absolute output file path.
        """
        out_dir = Path(self.config.output_dir) / persona_name
        out_dir.mkdir(parents=True, exist_ok=True)

        timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
        results: dict[str, str] = {}

        for ratio in self.config.aspect_ratios:
            w, h = RESOLUTION_MAP[ratio]
            ratio_tag = ratio.value.replace(":", "x")
            filename = f"{persona_name}_{timestamp}_{ratio_tag}.mp4"
            out_path = out_dir / filename

            # Step 1: mux + scale to target resolution
            muxed = self._mux_and_scale(
                video_path=video_path,
                audio_path=audio_path,
                out_path=str(out_path),
                width=w,
                height=h,
            )

            # Step 2: optional RIFE 60fps upscaling
            if self.config.enable_rife and self.config.fps < 60:
                muxed = self._apply_rife(muxed, out_dir, filename)

            results[ratio.value] = muxed

        return results

    def _mux_and_scale(
        self,
        video_path: str,
        audio_path: str,
        out_path: str,
        width: int,
        height: int,
    ) -> str:
        """
        Mux video + audio, scale/pad to target resolution (1080p),
        and encode with H.264 at the configured CRF.

        Uses ffmpeg scale+pad filter to letterbox/pillarbox as needed
        without cropping content.
        """
        scale_filter = (
            f"scale={width}:{height}:force_original_aspect_ratio=decrease,"
            f"pad={width}:{height}:(ow-iw)/2:(oh-ih)/2:black"
        )
        cmd = [
            "ffmpeg", "-y",
            "-i", video_path,
            "-i", audio_path,
            "-vf", scale_filter,
            "-r", str(self.config.fps),
            "-c:v", "libx264",
            "-crf", str(self.config.crf),
            "-preset", "medium",
            "-c:a", "aac",
            "-b:a", self.config.audio_bitrate,
            "-map", "0:v:0",
            "-map", "1:a:0",
            "-shortest",
            "-pix_fmt", "yuv420p",
            "-movflags", "+faststart",
            out_path,
        ]
        result = subprocess.run(cmd, capture_output=True)
        if result.returncode != 0:
            raise RuntimeError(
                f"ffmpeg mux/scale failed:\n{result.stderr.decode()}"
            )
        return str(Path(out_path).resolve())

    def _apply_rife(
        self,
        video_path: str,
        out_dir: Path,
        original_filename: str,
    ) -> str:
        """
        Apply RIFE frame interpolation to double the framerate (30→60fps).

        Requires RIFE installed to models/RIFE and inference_video.py present.
        Replaces the original output file with the interpolated version.
        """
        rife_out = out_dir / ("rife_" + original_filename)
        inference_script = Path(self.config.rife_model_dir) / "inference_video.py"

        if not inference_script.exists():
            raise FileNotFoundError(
                f"RIFE inference script not found at {inference_script}. "
                "Clone RIFE to models/RIFE/ or disable enable_rife."
            )

        cmd = [
            "python", str(inference_script),
            "--video", video_path,
            "--output", str(rife_out),
            "--scale", "1.0",
            "--exp", "1",  # 2^1 = 2x frame count (30→60fps)
        ]
        result = subprocess.run(cmd, capture_output=True)
        if result.returncode != 0:
            raise RuntimeError(
                f"RIFE interpolation failed:\n{result.stderr.decode()}"
            )
        return str(rife_out.resolve())
