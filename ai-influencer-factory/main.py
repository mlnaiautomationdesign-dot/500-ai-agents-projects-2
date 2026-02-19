"""
AI Influencer Factory — Main Orchestrator
==========================================
Full pipeline entry point. Executes the following stages in order:

  1. Load persona          (PersonaEngine)
  2. Generate script       (ScriptGenerator  — LLM)
  3. Detect emotion        (EmotionController — heuristic / ML)
  4. Generate voice        (VoiceGenerator   — TTS)
  5. Generate face         (FaceAnimator     — SadTalker / Wav2Lip / D-ID)
  6. Generate body         (BodyAnimator     — optional, skip with --no-body)
  7. Render                (Renderer         — FFmpeg + optional RIFE)
  8. Export                (Exporter         — per-platform transcode)

Usage:
    python main.py --persona alex_tech --topic "Top 5 AI tools of 2025" \
        --platform tiktok youtube --duration 60

    python main.py --persona luna_fitness --topic "5-minute morning routine" \
        --platform instagram --no-body --no-rife
"""

from __future__ import annotations

import argparse
import json
import os
import sys
import uuid
from pathlib import Path

# ---------------------------------------------------------------------------
# Module imports
# ---------------------------------------------------------------------------
from core.persona_engine import PersonaEngine
from core.script_generator import ScriptGenerator
from core.emotion_controller import EmotionController
from avatar.voice import VoiceGenerator
from avatar.face import FaceAnimator
from avatar.body import BodyAnimator, MotionParams
from avatar.renderer import Renderer, RenderConfig, AspectRatio
from distribution.exporter import Exporter, Platform
from distribution.formatter import Formatter


# ---------------------------------------------------------------------------
# Platform → aspect ratio mapping
# ---------------------------------------------------------------------------

PLATFORM_ASPECT: dict[str, AspectRatio] = {
    "tiktok":    AspectRatio.VERTICAL,
    "instagram": AspectRatio.VERTICAL,
    "youtube":   AspectRatio.HORIZONTAL,
    "twitter":   AspectRatio.HORIZONTAL,
    "linkedin":  AspectRatio.HORIZONTAL,
}

PLATFORM_ENUM: dict[str, Platform] = {
    p.value: p for p in Platform
}


# ---------------------------------------------------------------------------
# Pipeline
# ---------------------------------------------------------------------------

def run_pipeline(args: argparse.Namespace) -> None:
    job_id = args.job_id or f"job_{uuid.uuid4().hex[:8]}"
    print(f"\n{'='*54}")
    print(f"  AI Influencer Factory — Job: {job_id}")
    print(f"{'='*54}\n")

    # -----------------------------------------------------------------------
    # Stage 1: Load persona
    # -----------------------------------------------------------------------
    print("[1/8] Loading persona...")
    engine = PersonaEngine(config_path=args.config)
    persona = engine.load(args.persona)
    print(f"      Persona  : {persona.name} ({persona.niche})")
    print(f"      Voice    : {persona.voice_id} via {persona.voice_provider}")
    print(f"      WPM      : {persona.pacing.words_per_minute}")

    # -----------------------------------------------------------------------
    # Stage 2: Generate script
    # -----------------------------------------------------------------------
    print("\n[2/8] Generating script via LLM...")
    primary_platform = args.platforms[0]
    gen = ScriptGenerator(provider=args.llm_provider)
    script = gen.generate(
        persona_name=persona.name,
        niche=persona.niche,
        tone=_tone_description(persona.tone),
        topic=args.topic,
        platform=primary_platform,
        target_duration=args.duration,
        persona_id=persona.id,
    )
    print(f"      Provider : {script.llm_provider}  |  Tokens: {script.tokens_used}")
    print(f"      Segments : {len(script.segments)}  |  Est. duration: {script.estimated_duration}s")
    print(f"      Safety   : {'PASSED' if script.safety_passed else 'FAILED'}")
    if not script.safety_passed:
        print("      ERROR: Script failed safety filter. Aborting.")
        sys.exit(1)

    # -----------------------------------------------------------------------
    # Stage 3: Detect emotion
    # -----------------------------------------------------------------------
    print("\n[3/8] Detecting emotion timeline...")
    ec = EmotionController(words_per_minute=persona.pacing.words_per_minute)
    timeline = ec.process(script.full_text)
    dominant_emotions = [seg.emotion.dominant() for seg in timeline]
    print(f"      Segments : {len(timeline)}  |  Duration: {ec.total_duration(timeline):.1f}s")
    print(f"      Emotions : {', '.join(dict.fromkeys(dominant_emotions))}")

    if args.save_emotion_timeline:
        tl_path = f"output/{job_id}_emotion_timeline.json"
        os.makedirs("output", exist_ok=True)
        with open(tl_path, "w") as fh:
            json.dump(ec.to_dict(timeline), fh, indent=2)
        print(f"      Saved    : {tl_path}")

    # -----------------------------------------------------------------------
    # Stage 4: Generate voice
    # -----------------------------------------------------------------------
    print("\n[4/8] Synthesising voice...")
    vg = VoiceGenerator(
        provider=args.tts_provider,
        output_dir="output/audio",
    )
    audio_path = vg.synthesize(
        text=script.full_text,
        voice_id=persona.voice_id,
        job_id=job_id,
        speaking_rate=_energy_to_rate(persona.tone.energy),
    )
    print(f"      Audio    : {audio_path}")

    # -----------------------------------------------------------------------
    # Stage 5: Generate face animation
    # -----------------------------------------------------------------------
    print("\n[5/8] Generating face animation...")
    if not persona.avatar_image or not os.path.exists(persona.avatar_image):
        print(
            f"      WARNING: Avatar image not found at '{persona.avatar_image}'. "
            "Skipping face animation."
        )
        face_video = None
    else:
        fa = FaceAnimator(
            backend=args.face_backend,
            output_dir="output/face",
            device=args.device,
        )
        face_video = fa.animate(
            image_path=persona.avatar_image,
            audio_path=audio_path,
            job_id=job_id,
            expression_scale=_emotion_to_expression_scale(timeline),
            still_mode=args.still_mode,
        )
        print(f"      Video    : {face_video}")

    # -----------------------------------------------------------------------
    # Stage 6: Body animation (optional)
    # -----------------------------------------------------------------------
    if face_video and not args.no_body:
        print("\n[6/8] Applying body motion...")
        motion = MotionParams(
            idle_sway=persona.tone.energy * 0.4,
            gesture_rate=persona.tone.energy * 0.5,
            head_nod=persona.baseline_emotion.confidence * 0.4,
            posture="upright",
            energy=persona.tone.energy,
        )
        ba = BodyAnimator(
            full_body=args.full_body,
            output_dir="output/body",
            device=args.device,
        )
        body_video = ba.apply_motion(
            face_video_path=face_video,
            motion_params=motion,
            job_id=job_id,
            audio_path=audio_path,
        )
        print(f"      Video    : {body_video}")
        input_video = body_video
    else:
        if args.no_body:
            print("\n[6/8] Body animation skipped (--no-body).")
        else:
            print("\n[6/8] Body animation skipped (no face video).")
        input_video = face_video or audio_path  # fallback if no avatar

    # -----------------------------------------------------------------------
    # Stage 7: Render
    # -----------------------------------------------------------------------
    print("\n[7/8] Rendering final video...")

    # Use the aspect ratio appropriate for the primary export platform
    aspect = PLATFORM_ASPECT.get(primary_platform, AspectRatio.VERTICAL)

    render_cfg = RenderConfig(
        aspect_ratio=aspect,
        fps=args.fps,
        crf=args.crf,
        use_rife=args.rife,
        target_fps=60 if args.rife else args.fps,
        add_captions=bool(args.captions),
        caption_file=args.captions or None,
    )

    renderer = Renderer(output_dir="output/rendered")

    if input_video and os.path.exists(input_video) and os.path.exists(audio_path):
        final_video = renderer.render(
            video_path=input_video,
            audio_path=audio_path,
            job_id=job_id,
            config=render_cfg,
        )
        print(f"      Final    : {final_video}")
    else:
        print("      ERROR: No valid video + audio pair available. Cannot render.")
        sys.exit(1)

    # -----------------------------------------------------------------------
    # Stage 8: Export per platform
    # -----------------------------------------------------------------------
    print("\n[8/8] Exporting for platforms...")
    target_platforms = [
        PLATFORM_ENUM[p] for p in args.platforms if p in PLATFORM_ENUM
    ]
    if not target_platforms:
        print(f"      WARNING: No valid platforms in {args.platforms}. Defaulting to TikTok.")
        target_platforms = [Platform.TIKTOK]

    exporter = Exporter(output_dir="output/exports")
    results = exporter.export(
        video_path=final_video,
        persona_name=persona.name,
        platforms=target_platforms,
    )

    # Format metadata
    formatter = Formatter()
    for result in results:
        post = formatter.format(
            script_text=script.full_text,
            persona_name=persona.name,
            niche=persona.niche,
            platform=result.platform,
            scheduled_at=None,
        )
        meta_path = result.output_path.replace(".mp4", "_meta.json")
        with open(meta_path, "w") as fh:
            json.dump(
                {
                    "title":        post.title,
                    "description":  post.description,
                    "hashtags":     post.hashtags,
                    "ai_disclosure": post.ai_disclosure,
                    "platform":     post.platform.value,
                    "job_id":       job_id,
                    "persona_id":   persona.id,
                    "script_topic": args.topic,
                },
                fh,
                indent=2,
            )

    exporter.print_summary(results)
    print(f"  Job '{job_id}' complete.\n")


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _tone_description(tone) -> str:
    parts = []
    if tone.energy > 0.7:
        parts.append("high-energy")
    elif tone.energy < 0.4:
        parts.append("calm")
    if tone.confidence > 0.7:
        parts.append("confident")
    if tone.humor > 0.5:
        parts.append("humorous")
    if tone.warmth > 0.7:
        parts.append("warm and empathetic")
    if tone.formality > 0.6:
        parts.append("formal")
    elif tone.formality < 0.4:
        parts.append("casual")
    return ", ".join(parts) if parts else "engaging and authentic"


def _energy_to_rate(energy: float) -> float:
    """Map energy (0–1) to TTS speaking rate (0.85–1.25)."""
    return round(0.85 + energy * 0.40, 2)


def _emotion_to_expression_scale(timeline) -> float:
    """Derive SadTalker expression_scale from mean emotion intensity."""
    if not timeline:
        return 1.0
    mean_intensity = sum(s.intensity for s in timeline) / len(timeline)
    return round(0.7 + mean_intensity * 0.8, 2)


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------

def _parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser(
        description="AI Influencer Factory — end-to-end content pipeline",
        formatter_class=argparse.ArgumentDefaultsHelpFormatter,
    )

    # Required
    parser.add_argument(
        "--persona", required=True,
        help="Persona ID from configs/personas.json (e.g. alex_tech)",
    )
    parser.add_argument(
        "--topic", required=True,
        help="Content topic / brief for script generation",
    )

    # Optional pipeline controls
    parser.add_argument(
        "--platforms", nargs="+",
        default=["tiktok"],
        choices=["tiktok", "youtube", "instagram", "twitter", "linkedin"],
        help="Target export platforms (space-separated)",
    )
    parser.add_argument(
        "--duration", type=int, default=60,
        help="Target video duration in seconds",
    )
    parser.add_argument(
        "--config", default="configs/personas.json",
        help="Path to personas JSON config",
    )
    parser.add_argument(
        "--job-id", dest="job_id", default=None,
        help="Custom job ID for artifact naming (auto-generated if omitted)",
    )

    # LLM / TTS / renderer providers
    parser.add_argument(
        "--llm-provider", dest="llm_provider",
        choices=["anthropic", "openai"], default="anthropic",
    )
    parser.add_argument(
        "--tts-provider", dest="tts_provider",
        choices=["elevenlabs", "coqui", "gtts"], default="elevenlabs",
    )
    parser.add_argument(
        "--face-backend", dest="face_backend",
        choices=["sadtalker", "wav2lip", "did"], default="sadtalker",
    )

    # Avatar options
    parser.add_argument(
        "--no-body", action="store_true",
        help="Skip body animation stage",
    )
    parser.add_argument(
        "--full-body", action="store_true",
        help="Use full-body AnimateDiff mode (requires models/animatediff/)",
    )
    parser.add_argument(
        "--still-mode", action="store_true",
        help="Minimise head movement (lips only) in face animation",
    )

    # Renderer options
    parser.add_argument("--fps", type=int, default=30)
    parser.add_argument("--crf", type=int, default=18)
    parser.add_argument(
        "--rife", action="store_true",
        help="Enable RIFE 60fps frame interpolation (requires models/RIFE/)",
    )
    parser.add_argument(
        "--captions", default=None,
        help="Path to .srt caption file to burn into the video",
    )
    parser.add_argument(
        "--device", choices=["cuda", "cpu"], default="cuda",
        help="Compute device for GPU-backed stages",
    )
    parser.add_argument(
        "--save-emotion-timeline", action="store_true",
        dest="save_emotion_timeline",
        help="Save the emotion vector timeline as JSON for inspection",
    )

    return parser.parse_args()


# ---------------------------------------------------------------------------
# Entry point
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    args = _parse_args()
    run_pipeline(args)
