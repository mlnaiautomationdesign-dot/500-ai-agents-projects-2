"""
Body Animator
=============
Applies naturalistic body motion to a face-animated video.

Modes:
  full_body=False  — Lightweight: FFmpeg-driven head/shoulder sway overlay.
                     Zero additional GPU cost; always available.
  full_body=True   — Full-body: AnimateDiff pipeline (requires models/animatediff/).
                     Falls back to head/shoulder mode if models are absent.

The module merges the motion result with the original speech audio, producing
a single video artifact ready for the Renderer stage.

Output: MP4 at output/body/{job_id}_merged.mp4
"""

from __future__ import annotations

import os
import subprocess
from dataclasses import dataclass
from pathlib import Path


# ---------------------------------------------------------------------------
# Data model
# ---------------------------------------------------------------------------

@dataclass
class MotionParams:
    """
    High-level motion parameters translated to animation instructions.

    All float values are normalised to 0.0–1.0 unless noted otherwise.
    """
    idle_sway: float = 0.3          # Magnitude of passive body sway
    gesture_rate: float = 0.4       # Frequency of hand/arm gestures
    head_nod: float = 0.3           # Nodding intensity
    posture: str = "upright"        # upright | relaxed | leaning
    energy: float = 0.5             # Overall motion energy level


# ---------------------------------------------------------------------------
# Posture presets (geometric offsets applied via FFmpeg)
# ---------------------------------------------------------------------------

_POSTURE_PRESETS: dict[str, dict[str, float]] = {
    "upright": {"tilt_deg": 0.0,  "crop_offset_x": 0, "scale_up": 1.00},
    "relaxed":  {"tilt_deg": 1.5,  "crop_offset_x": 4, "scale_up": 1.01},
    "leaning":  {"tilt_deg": 3.0,  "crop_offset_x": 8, "scale_up": 1.02},
}


# ---------------------------------------------------------------------------
# Animator
# ---------------------------------------------------------------------------

class BodyAnimator:
    """
    Applies body motion to a face-animated video and merges with audio.

    Usage:
        ba = BodyAnimator(full_body=False)
        merged_path = ba.apply_motion(
            face_video_path="output/face/job_001_face.mp4",
            motion_params=MotionParams(idle_sway=0.4, energy=0.7),
            job_id="job_001",
            audio_path="output/audio/job_001_speech.wav",
        )
    """

    def __init__(
        self,
        full_body: bool = False,
        animatediff_path: str = "models/animatediff",
        output_dir: str = "output/body",
        device: str = "cuda",
    ):
        self.full_body = full_body
        self.animatediff_path = animatediff_path
        self.output_dir = output_dir
        self.device = device
        os.makedirs(output_dir, exist_ok=True)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def apply_motion(
        self,
        face_video_path: str,
        motion_params: MotionParams,
        job_id: str,
        audio_path: str | None = None,
    ) -> str:
        """
        Apply body motion to a face-animated video.

        Args:
            face_video_path: Output video from FaceAnimator.
            motion_params:   MotionParams controlling animation style.
            job_id:          Unique identifier for output artifact.
            audio_path:      Optional explicit audio to mux into the final file.
                             If None, audio embedded in face_video_path is used.

        Returns:
            Path to the merged video with body motion applied.
        """
        if not os.path.exists(face_video_path):
            raise FileNotFoundError(f"Face video not found: {face_video_path}")

        if self.full_body and os.path.exists(
            os.path.join(self.animatediff_path, "animate.py")
        ):
            motion_video = self._full_body_animatediff(
                face_video_path, motion_params, job_id
            )
        else:
            if self.full_body:
                print(
                    f"[BodyAnimator] AnimateDiff models not found at "
                    f"'{self.animatediff_path}'. Falling back to head/shoulder mode."
                )
            motion_video = self._head_shoulder_ffmpeg(
                face_video_path, motion_params, job_id
            )

        merged = self._merge_audio(motion_video, face_video_path, audio_path, job_id)
        return merged

    # ------------------------------------------------------------------
    # Motion implementations
    # ------------------------------------------------------------------

    def _head_shoulder_ffmpeg(
        self,
        face_video: str,
        params: MotionParams,
        job_id: str,
    ) -> str:
        """
        Lightweight body-sway simulation using FFmpeg geometric filters.

        Applies:
          - Subtle rotation matching the persona's posture preset
          - Slight scale-up + centre crop to hide rotation borders
          - Minimal zoom pulse to simulate breathing / idle sway
        """
        output_path = os.path.join(self.output_dir, f"{job_id}_body_hs.mp4")
        preset = _POSTURE_PRESETS.get(params.posture, _POSTURE_PRESETS["upright"])

        tilt = preset["tilt_deg"] * (1.0 + params.energy * 0.5)
        scale = preset["scale_up"] + params.idle_sway * 0.02  # max ~2% scale
        crop_x = int(preset["crop_offset_x"] * params.idle_sway)

        # Breathing sway: slow sinusoidal zoom (period ~4 seconds)
        zoom_amplitude = params.idle_sway * 0.015
        vf = (
            f"scale=iw*{scale:.4f}:ih*{scale:.4f},"
            f"crop=iw/{scale:.4f}:ih/{scale:.4f}:{crop_x}:0,"
            f"rotate={tilt:.2f}*PI/180:fillcolor=black@0:ow=iw:oh=ih,"
            f"zoompan=z='1+{zoom_amplitude:.4f}*sin(2*PI*on/({4*25}))'"
            f":x='iw/2-(iw/zoom/2)':y='ih/2-(ih/zoom/2)':d=1:s=iw x ih"
        )

        cmd = [
            "ffmpeg", "-y",
            "-i", face_video,
            "-vf", vf,
            "-c:v", "libx264", "-preset", "fast", "-crf", "18",
            "-c:a", "copy",
            output_path,
        ]
        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"FFmpeg head/shoulder motion failed:\n{result.stderr}")
        return output_path

    def _full_body_animatediff(
        self,
        face_video: str,
        params: MotionParams,
        job_id: str,
    ) -> str:
        """Full-body animation via AnimateDiff (requires GPU + models)."""
        output_path = os.path.join(self.output_dir, f"{job_id}_body_full.mp4")
        script = os.path.join(self.animatediff_path, "animate.py")

        cmd = [
            "python", script,
            "--input",        face_video,
            "--output",       output_path,
            "--sway",         str(params.idle_sway),
            "--gesture_rate", str(params.gesture_rate),
            "--energy",       str(params.energy),
            "--posture",      params.posture,
        ]
        if self.device == "cpu":
            cmd.append("--cpu")

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"AnimateDiff failed:\n{result.stderr}")
        return output_path

    # ------------------------------------------------------------------
    # Audio merge
    # ------------------------------------------------------------------

    def _merge_audio(
        self,
        motion_video: str,
        face_video: str,
        audio_path: str | None,
        job_id: str,
    ) -> str:
        """
        Mux the motion video with the correct audio track.

        Priority:
          1. Explicit audio_path (speech WAV from VoiceGenerator)
          2. Audio stream embedded in face_video
        """
        output_path = os.path.join(self.output_dir, f"{job_id}_merged.mp4")

        if audio_path and os.path.exists(audio_path):
            cmd = [
                "ffmpeg", "-y",
                "-i", motion_video,
                "-i", audio_path,
                "-map", "0:v:0",
                "-map", "1:a:0",
                "-c:v", "copy",
                "-c:a", "aac", "-b:a", "192k",
                "-shortest",
                output_path,
            ]
        else:
            # Carry the audio that's already in the motion video
            cmd = [
                "ffmpeg", "-y",
                "-i", motion_video,
                "-c", "copy",
                output_path,
            ]

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"Audio merge failed:\n{result.stderr}")
        return output_path
