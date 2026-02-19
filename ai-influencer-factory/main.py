"""
AI Influencer Factory — Main Pipeline
======================================
Full 8-step pipeline:

  1. Load Persona         — from configs/personas.json
  2. Generate Script      — LLM-driven content for topic + platform
  3. Detect Emotion       — segment script into emotion vector timeline
  4. Generate Voice       — XTTS-v2 (local) → speech.wav
  5. Generate Face        — SadTalker lip-sync animation → face video
  6. Generate Body        — (optional) composite body + face → merged video
  7. Render               — 1080p multi-ratio output (9:16, 16:9)
  8. Export               — platform-ready files (TikTok, YouTube, Instagram)

Environment:
  Set DRY_RUN=false to enable live API publishing.
  All API keys must be set in .env — never hardcoded.
"""

import os
import sys
from pathlib import Path

# ── 0. Bootstrap ─────────────────────────────────────────────────────────────
# Load .env if present
try:
    from dotenv import load_dotenv
    load_dotenv()
except ImportError:
    pass  # python-dotenv optional; set vars manually if not installed

# Add project root to path for imports
sys.path.insert(0, str(Path(__file__).parent))

from core.persona_engine import PersonaEngine
from core.emotion_controller import EmotionController
from core.script_generator import ScriptGenerator
from avatar.face import FaceAnimator, FaceAnimationParams
from avatar.body import BodyAnimator, MotionParameters
from avatar.voice import VoiceSynthesizer, TTSBackend
from avatar.renderer import AvatarRenderer, RenderConfig, AspectRatio
from distribution.formatter import ContentFormatter, Platform
from distribution.exporter import ExporterFactory


def run_pipeline(
    persona_name: str = "Aria",
    topic: str = "5 morning habits that changed my mental health",
    platforms: list[str] | None = None,
    enable_body: bool = False,
    reference_wav: str | None = None,
    dry_run: bool = True,
) -> dict:
    """
    Execute the full AI Influencer Factory pipeline.

    Args:
        persona_name:   Name of the persona from configs/personas.json.
        topic:          Content topic for script generation.
        platforms:      List of export platforms. Default: ["tiktok", "youtube"].
        enable_body:    If True, add body compositing step (step 6).
        reference_wav:  Path to voice reference WAV for XTTS-v2 cloning.
                        Required if TTS backend is XTTS.
        dry_run:        If True, skip live API publishing.

    Returns:
        dict with all generated asset paths and export results.
    """
    if platforms is None:
        platforms = ["tiktok", "youtube"]

    results: dict = {}

    # ── Step 1: Load Persona ─────────────────────────────────────────────────
    print(f"\n[1/8] Loading persona: {persona_name}")
    engine = PersonaEngine()
    engine.load()
    persona = engine.get(persona_name)
    print(f"      Loaded: {persona.name} | Niche: {persona.niche}")
    results["persona"] = persona.name

    # ── Step 2: Generate Script ──────────────────────────────────────────────
    print(f"\n[2/8] Generating script for topic: '{topic}'")
    emotion_ctrl = EmotionController(mode="rule")
    script_gen = ScriptGenerator(
        persona=persona,
        emotion_controller=emotion_ctrl,
    )
    script = script_gen.generate_script(
        topic=topic,
        platform=platforms[0] if platforms else "tiktok",
        duration_seconds=60,
    )
    caption = script_gen.generate_caption(topic=topic, platform="instagram")
    print(f"      Script: {len(script)} chars | Caption: {len(caption)} chars")
    results["script"] = script
    results["caption"] = caption

    # ── Step 3: Detect Emotion ───────────────────────────────────────────────
    print("\n[3/8] Analyzing emotion timeline")
    controller = EmotionController(mode="rule")
    timeline = controller.analyze(script)
    keyframes = timeline.to_keyframes()
    print(f"      Detected {len(keyframes)} emotion segments")
    results["emotion_keyframes"] = keyframes

    # Use the dominant emotion for body animation params
    avg_arousal = sum(kf["arousal"] for kf in keyframes) / max(len(keyframes), 1)
    avg_dominance = sum(kf["dominance"] for kf in keyframes) / max(len(keyframes), 1)

    # ── Step 4: Generate Voice ───────────────────────────────────────────────
    print("\n[4/8] Synthesizing voice")
    tts_backend = TTSBackend.XTTS if reference_wav else TTSBackend.GTTS
    voice_synth = VoiceSynthesizer(
        backend=tts_backend,
        language=persona.language,
        reference_wav=reference_wav,
    )
    audio_path = voice_synth.synthesize(
        text=script,
        output_path=f"output/{persona_name}/speech.wav",
    )
    print(f"      Audio saved: {audio_path}")
    results["audio_path"] = audio_path

    # ── Step 5: Generate Face ────────────────────────────────────────────────
    print("\n[5/8] Generating face animation")
    face_animator = FaceAnimator()

    # Default portrait: use a placeholder or first available image
    face_image = f"output/{persona_name}/face.png"
    if not Path(face_image).exists():
        print(f"      WARNING: No face image at {face_image}. "
              "Run face generation first or provide a portrait image.")
        face_video_path = None
    else:
        face_anim_params = FaceAnimationParams(
            expression_scale=1.0 + avg_arousal * 0.5,
            still_mode=avg_arousal < 0.3,
        )
        face_video_path = face_animator.animate(
            image_path=face_image,
            audio_path=audio_path,
            output_dir=f"output/{persona_name}",
            params=face_anim_params,
        )
        print(f"      Face video: {face_video_path}")

    results["face_video"] = face_video_path

    # ── Step 6: Generate Body (optional) ─────────────────────────────────────
    video_for_render = face_video_path

    if enable_body and face_video_path:
        print("\n[6/8] Compositing body animation")
        body_image = f"output/{persona_name}/body.png"
        motion_params = MotionParameters.from_emotion_vector(
            arousal=avg_arousal,
            dominance=avg_dominance,
        )
        body_animator = BodyAnimator(output_dir=f"output/{persona_name}")
        body_video_path = body_animator.generate_and_merge(
            face_video_path=face_video_path,
            body_image_path=body_image,
            motion_params=motion_params,
            persona_name=persona_name,
            audio_path=audio_path,
        )
        print(f"      Body merge: {body_video_path}")
        video_for_render = body_video_path
        results["body_video"] = body_video_path
    else:
        print("\n[6/8] Body step skipped (enable_body=False or no face video)")

    # ── Step 7: Render ───────────────────────────────────────────────────────
    print("\n[7/8] Rendering final outputs")
    rendered_videos: dict[str, str] = {}

    if video_for_render:
        render_config = RenderConfig(
            aspect_ratios=[AspectRatio.PORTRAIT, AspectRatio.LANDSCAPE],
            fps=30,
            enable_rife=False,
            crf=18,
        )
        renderer = AvatarRenderer(config=render_config)
        rendered_videos = renderer.render(
            video_path=video_for_render,
            audio_path=audio_path,
            persona_name=persona_name,
        )
        for ratio, path in rendered_videos.items():
            print(f"      [{ratio}] → {path}")
    else:
        print("      Skipped: no video to render")

    results["rendered_videos"] = rendered_videos

    # ── Step 8: Export ───────────────────────────────────────────────────────
    print(f"\n[8/8] Exporting to platforms: {platforms}")
    formatter = ContentFormatter()
    hashtags = list(persona.tags) + ["AIinfluencer", "contentcreator"]
    formatted = formatter.format(
        platform=Platform.INSTAGRAM,
        caption=caption,
        hashtags=hashtags,
    )

    export_results: dict[str, dict] = {}
    for platform in platforms:
        exporter = ExporterFactory.get(platform, dry_run=dry_run)
        export_result = exporter.publish(
            content=formatted,
            rendered_videos=rendered_videos,
            persona_name=persona_name,
        )
        export_results[platform] = export_result
        status = export_result.get("status", "unknown")
        print(f"      [{platform}] status={status}")

    results["exports"] = export_results

    print("\n[Pipeline Complete]")
    return results


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser(description="AI Influencer Factory")
    parser.add_argument("--persona", default="Aria", help="Persona name from configs/personas.json")
    parser.add_argument("--topic", default="5 morning habits that changed my mental health")
    parser.add_argument("--platforms", nargs="+", default=["tiktok", "youtube"])
    parser.add_argument("--body", action="store_true", help="Enable body compositing step")
    parser.add_argument("--reference-wav", default=None, help="Path to reference voice WAV (XTTS-v2)")
    parser.add_argument("--live", action="store_true", help="Enable live API publishing (disables dry-run)")
    args = parser.parse_args()

    dry_run = not args.live
    print(f"AI Influencer Factory starting (dry_run={dry_run})")

    run_pipeline(
        persona_name=args.persona,
        topic=args.topic,
        platforms=args.platforms,
        enable_body=args.body,
        reference_wav=args.reference_wav,
        dry_run=dry_run,
    )
