"""
Face Animator
-------------
Accepts a portrait image and a speech WAV, drives lip-sync and facial
animation using SadTalker (local), and returns the path to a face video.

SadTalker generates talking-head video from:
  - A single reference portrait image
  - A driving audio WAV (the synthesized speech)

Output: face_animated.mp4
"""

from pathlib import Path
from dataclasses import dataclass


@dataclass
class FaceAnimationParams:
    """
    Controls how SadTalker animates the face.

    pose_style:      0–45 — head motion style preset.
    expression_scale: 1.0 = default, >1 = more expressive.
    still_mode:      True = minimal head motion (talking only).
    preprocess:      "crop" (recommended) or "full" or "extcrop".
    """
    pose_style: int = 0
    expression_scale: float = 1.0
    still_mode: bool = False
    preprocess: str = "crop"
    enhancer: str | None = "gfpgan"  # Face restoration: "gfpgan" | None


class FaceAnimator:
    """
    Drives lip-sync animation on a portrait image using a speech WAV.

    Wraps SadTalker inference. SadTalker must be installed and its
    checkpoints placed in models/SadTalker/ (see project README).

    Returns:
        Path to the generated face animation video (MP4).
    """

    def __init__(self, sadtalker_dir: str = "models/SadTalker") -> None:
        self.sadtalker_dir = Path(sadtalker_dir)

    def animate(
        self,
        image_path: str,
        audio_path: str,
        output_dir: str = "output",
        params: FaceAnimationParams | None = None,
    ) -> str:
        """
        Generate a talking-head video from image + audio.

        Args:
            image_path:  Path to the portrait image (PNG/JPG).
            audio_path:  Path to the speech WAV file.
            output_dir:  Directory to save the result.
            params:      Animation parameter overrides.

        Returns:
            Absolute path to the output face video (MP4).
        """
        if params is None:
            params = FaceAnimationParams()

        out_dir = Path(output_dir)
        out_dir.mkdir(parents=True, exist_ok=True)

        return self._run_sadtalker(
            image_path=image_path,
            audio_path=audio_path,
            output_dir=str(out_dir),
            params=params,
        )

    def _run_sadtalker(
        self,
        image_path: str,
        audio_path: str,
        output_dir: str,
        params: FaceAnimationParams,
    ) -> str:
        """
        Invoke SadTalker inference via its Python API.

        SadTalker must be cloned to models/SadTalker and its
        requirements installed in the environment.
        """
        import sys
        sys.path.insert(0, str(self.sadtalker_dir))

        # SadTalker exposes SadTalker class in its inference module
        from inference import SadTalker  # type: ignore

        talker = SadTalker(
            checkpoint_path=str(self.sadtalker_dir / "checkpoints"),
            config_path=str(self.sadtalker_dir / "src" / "config"),
            lazy_load=True,
        )

        result_path = talker.test(
            source_image=image_path,
            driven_audio=audio_path,
            preprocess=params.preprocess,
            still=params.still_mode,
            use_enhancer=params.enhancer is not None,
            batch_size=1,
            size=256,
            pose_style=params.pose_style,
            expression_scale=params.expression_scale,
            result_dir=output_dir,
        )

        return str(Path(result_path).resolve())
