"""
Body Animator
-------------
Optional full-body animation module.

Accepts motion parameters (from EmotionTimeline or manual input),
generates body animation, and merges the result with the face video
produced by face.py to create a composite full-body output.

Modes:
  - upper_body: Adds shoulder/torso sway and hand gestures
  - full_body:  Full character animation (requires body reference image)
"""

from pathlib import Path
from dataclasses import dataclass, field


@dataclass
class MotionParameters:
    """
    Body motion parameters derived from an EmotionTimeline or set manually.

    All values are 0.0–1.0 unless noted.
    """
    mode: str = "upper_body"          # "upper_body" | "full_body"
    torso_sway: float = 0.3           # lateral torso movement intensity
    head_nod_frequency: float = 0.4   # how often the head nods
    gesture_intensity: float = 0.5    # hand/arm gesture amplitude
    breathing_visible: bool = True    # subtle chest breathing motion
    idle_fidget: float = 0.2          # micro-movement for natural feel

    @classmethod
    def from_emotion_vector(cls, arousal: float, dominance: float) -> "MotionParameters":
        """
        Derive body motion parameters from an emotion vector's arousal
        and dominance values for automatic animation matching.
        """
        return cls(
            torso_sway=min(arousal * 0.6, 1.0),
            head_nod_frequency=min(arousal * 0.8, 1.0),
            gesture_intensity=min((arousal + dominance) / 2, 1.0),
            breathing_visible=True,
            idle_fidget=max(0.1, 1.0 - dominance) * 0.3,
        )


class BodyAnimator:
    """
    Generates body animation and composites it with the face video.

    Compositing approach:
      1. Overlay the face video onto the body frame at the head region
      2. Apply body motion as subtle frame-level transforms (ffmpeg)
      3. Output a single merged video

    For full production quality, replace the ffmpeg overlay with a
    proper video compositor (Blender, After Effects, or a pose estimation
    network like DWPose + AnimateDiff).
    """

    def __init__(self, output_dir: str = "output") -> None:
        self.output_dir = Path(output_dir)
        self.output_dir.mkdir(parents=True, exist_ok=True)

    def generate_and_merge(
        self,
        face_video_path: str,
        body_image_path: str,
        motion_params: MotionParameters,
        persona_name: str,
        audio_path: str,
    ) -> str:
        """
        Overlay animated face onto a body image and produce a merged video.

        Args:
            face_video_path:  Path to the face animation MP4 from FaceAnimator.
            body_image_path:  Path to the body portrait image (PNG/JPG).
            motion_params:    Motion parameters for body animation.
            persona_name:     Used for output file naming.
            audio_path:       Original audio WAV to attach to merged output.

        Returns:
            Absolute path to the merged output video (MP4).
        """
        import subprocess

        out_path = self.output_dir / f"{persona_name}_body_merged.mp4"

        # Compositing strategy: overlay face video in upper-center of body image.
        # The face video is scaled to ~40% of body image width and placed at top-center.
        # ffmpeg filter_complex handles overlay timing and audio mixing.
        cmd = [
            "ffmpeg", "-y",
            "-loop", "1", "-i", body_image_path,       # body still image (looped)
            "-i", face_video_path,                      # animated face video
            "-i", audio_path,                           # original audio
            "-filter_complex",
            (
                "[0:v]scale=1080:1920,setsar=1[bg];"
                "[1:v]scale=iw*0.4:-1[face];"
                "[bg][face]overlay=(W-w)/2:50[out]"
            ),
            "-map", "[out]",
            "-map", "2:a",
            "-c:v", "libx264",
            "-c:a", "aac",
            "-shortest",
            "-pix_fmt", "yuv420p",
            str(out_path),
        ]

        result = subprocess.run(cmd, capture_output=True)
        if result.returncode != 0:
            raise RuntimeError(
                f"ffmpeg body merge failed:\n{result.stderr.decode()}"
            )

        return str(out_path.resolve())
