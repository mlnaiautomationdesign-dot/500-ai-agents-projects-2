"""
Face Animator
=============
Drives lip-sync and facial animation from a still portrait image + speech WAV.

Supported backends:
  sadtalker  — Full head motion, self-hosted (GPU, models/sadtalker/)
  wav2lip    — Lip region only, self-hosted (GPU, models/Wav2Lip/)
  did        — D-ID managed cloud API (no GPU required; needs DID_API_KEY)

Output: MP4 video at output/face/{job_id}_face.mp4
"""

from __future__ import annotations

import base64
import json
import os
import shutil
import subprocess
import time
import urllib.request
from pathlib import Path


class FaceAnimator:
    """
    Generates a lip-synced face animation video from a portrait image and audio.

    Usage:
        fa = FaceAnimator(backend="sadtalker")
        video_path = fa.animate(
            image_path="configs/avatars/alex.png",
            audio_path="output/audio/job_001_speech.wav",
            job_id="job_001",
        )
    """

    SUPPORTED_BACKENDS = ("sadtalker", "wav2lip", "did")

    def __init__(
        self,
        backend: str = "sadtalker",
        sadtalker_path: str = "models/sadtalker",
        wav2lip_path: str = "models/Wav2Lip",
        output_dir: str = "output/face",
        device: str = "cuda",
    ):
        if backend not in self.SUPPORTED_BACKENDS:
            raise ValueError(
                f"backend must be one of {self.SUPPORTED_BACKENDS}, got '{backend}'"
            )
        self.backend = backend
        self.sadtalker_path = sadtalker_path
        self.wav2lip_path = wav2lip_path
        self.output_dir = output_dir
        self.device = device
        os.makedirs(output_dir, exist_ok=True)

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def animate(
        self,
        image_path: str,
        audio_path: str,
        job_id: str,
        expression_scale: float = 1.0,
        still_mode: bool = False,
    ) -> str:
        """
        Animate a face from a still portrait + speech audio.

        Args:
            image_path:       Path to source portrait (PNG/JPG).
            audio_path:       Path to speech WAV.
            job_id:           Unique identifier for artifact naming.
            expression_scale: Expression intensity multiplier (0.5–2.0).
            still_mode:       If True, minimise head motion (lips only).

        Returns:
            Path to the generated face animation MP4.

        Raises:
            FileNotFoundError: If image or audio is missing.
            RuntimeError:      If the selected backend fails.
        """
        if not os.path.exists(image_path):
            raise FileNotFoundError(f"Portrait image not found: {image_path}")
        if not os.path.exists(audio_path):
            raise FileNotFoundError(f"Speech audio not found: {audio_path}")

        if self.backend == "sadtalker":
            return self._sadtalker(image_path, audio_path, job_id, expression_scale, still_mode)
        elif self.backend == "wav2lip":
            return self._wav2lip(image_path, audio_path, job_id)
        elif self.backend == "did":
            return self._did_api(image_path, audio_path, job_id)
        else:
            raise NotImplementedError(f"Backend '{self.backend}' is not implemented.")

    # ------------------------------------------------------------------
    # Backend implementations
    # ------------------------------------------------------------------

    def _sadtalker(
        self,
        image_path: str,
        audio_path: str,
        job_id: str,
        expression_scale: float,
        still_mode: bool,
    ) -> str:
        output_path = os.path.join(self.output_dir, f"{job_id}_face.mp4")
        checkpoint_dir = os.path.join(self.sadtalker_path, "checkpoints")
        config_dir = os.path.join(self.sadtalker_path, "src", "config")
        inference_script = os.path.join(self.sadtalker_path, "inference.py")

        if not os.path.exists(inference_script):
            raise FileNotFoundError(
                f"SadTalker not found at {self.sadtalker_path}. "
                "Clone it or switch to the 'did' backend."
            )

        cmd = [
            "python", inference_script,
            "--driven_audio", audio_path,
            "--source_image", image_path,
            "--result_dir", self.output_dir,
            "--expression_scale", str(expression_scale),
            "--checkpoint_dir", checkpoint_dir,
            "--config_dir", config_dir,
        ]
        if still_mode:
            cmd.append("--still")
        if self.device == "cpu":
            cmd.append("--cpu")

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"SadTalker failed:\n{result.stderr}")

        # SadTalker names output by source image stem; locate and rename.
        generated = self._find_latest_mp4(self.output_dir, exclude=output_path)
        if generated and generated != output_path:
            shutil.move(generated, output_path)

        if not os.path.exists(output_path):
            raise RuntimeError(
                f"SadTalker completed but output not found at {output_path}"
            )
        return output_path

    def _wav2lip(self, image_path: str, audio_path: str, job_id: str) -> str:
        output_path = os.path.join(self.output_dir, f"{job_id}_face.mp4")
        inference_script = os.path.join(self.wav2lip_path, "inference.py")
        checkpoint = os.path.join(self.wav2lip_path, "checkpoints", "wav2lip_gan.pth")

        if not os.path.exists(inference_script):
            raise FileNotFoundError(
                f"Wav2Lip not found at {self.wav2lip_path}. "
                "Clone it or switch to the 'did' backend."
            )

        cmd = [
            "python", inference_script,
            "--checkpoint_path", checkpoint,
            "--face", image_path,
            "--audio", audio_path,
            "--outfile", output_path,
        ]

        result = subprocess.run(cmd, capture_output=True, text=True)
        if result.returncode != 0:
            raise RuntimeError(f"Wav2Lip failed:\n{result.stderr}")
        return output_path

    def _did_api(self, image_path: str, audio_path: str, job_id: str) -> str:
        """
        D-ID cloud API fallback. Requires DID_API_KEY in environment.
        Encodes assets as base64 data URIs, polls until complete, downloads result.
        """
        api_key = os.environ.get("DID_API_KEY")
        if not api_key:
            raise EnvironmentError(
                "DID_API_KEY is not set. "
                "Export it or switch to a self-hosted backend."
            )

        # Encode image
        ext = Path(image_path).suffix.lstrip(".")
        with open(image_path, "rb") as fh:
            img_b64 = base64.b64encode(fh.read()).decode()
        source_url = f"data:image/{ext};base64,{img_b64}"

        # Encode audio
        with open(audio_path, "rb") as fh:
            audio_b64 = base64.b64encode(fh.read()).decode()
        audio_url = f"data:audio/wav;base64,{audio_b64}"

        # Create talk
        payload = json.dumps(
            {"source_url": source_url, "script": {"type": "audio", "audio_url": audio_url}}
        ).encode()
        req = urllib.request.Request(
            "https://api.d-id.com/talks",
            data=payload,
            headers={
                "Authorization": f"Basic {api_key}",
                "Content-Type": "application/json",
            },
            method="POST",
        )
        with urllib.request.urlopen(req) as resp:
            talk_id = json.loads(resp.read())["id"]

        # Poll for completion (max 5 minutes)
        video_url = None
        for _ in range(60):
            time.sleep(5)
            poll_req = urllib.request.Request(
                f"https://api.d-id.com/talks/{talk_id}",
                headers={"Authorization": f"Basic {api_key}"},
            )
            with urllib.request.urlopen(poll_req) as resp:
                data = json.loads(resp.read())
            if data["status"] == "done":
                video_url = data["result_url"]
                break
            if data["status"] == "error":
                raise RuntimeError(f"D-ID render failed: {data}")
        else:
            raise TimeoutError("D-ID render timed out after 5 minutes.")

        output_path = os.path.join(self.output_dir, f"{job_id}_face.mp4")
        urllib.request.urlretrieve(video_url, output_path)
        return output_path

    # ------------------------------------------------------------------
    # Helpers
    # ------------------------------------------------------------------

    def _find_latest_mp4(self, directory: str, exclude: str = "") -> str | None:
        mp4_files = sorted(
            [p for p in Path(directory).glob("*.mp4") if str(p) != exclude],
            key=lambda p: p.stat().st_mtime,
            reverse=True,
        )
        return str(mp4_files[0]) if mp4_files else None
