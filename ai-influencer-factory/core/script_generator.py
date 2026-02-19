"""
Script Generator (LLM-Driven)
=============================
Generates structured, platform-ready scripts from a persona profile and
content brief using Anthropic Claude (primary) or OpenAI GPT-4o (fallback).

Output: a Script object with typed segments (hook, body, transition, cta),
each carrying text, estimated duration, and an emotion cue for the
Emotion Controller.
"""

from __future__ import annotations

import json
import os
from dataclasses import dataclass, field
from typing import Optional


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------

@dataclass
class ScriptSegment:
    """A single typed unit of a script."""
    type: str           # hook | body | transition | cta
    text: str
    duration_hint: float = 5.0    # Estimated seconds for this segment
    emotion_cue: str = "neutral"  # Feed into EmotionController as baseline hint


@dataclass
class Script:
    """Complete generated script returned by ScriptGenerator."""
    persona_id: str
    persona_name: str
    platform: str
    topic: str
    segments: list[ScriptSegment]
    full_text: str                  # Joined text of all segments
    estimated_duration: float       # Sum of segment duration_hints
    llm_provider: str
    tokens_used: int
    safety_passed: bool = True
    meta: dict = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Safety filter (pre/post generation)
# ---------------------------------------------------------------------------

_HARD_BLOCK_PATTERNS = [
    # Medical authority claims
    "as a doctor", "medical advice", "treat your", "diagnose",
    # Financial authority claims
    "invest in", "buy this stock", "guaranteed returns", "financial advice",
    # Legal claims
    "legal advice", "as your lawyer", "sue them",
    # Manipulation
    "vote for", "don't vote", "election",
    # Violence / self-harm
    "how to hurt", "kill yourself", "self harm",
]


def _safety_check(text: str) -> tuple[bool, str]:
    """
    Lightweight pre/post generation safety scan.
    Returns (passed, reason). Passed=False means hard block.
    """
    lower = text.lower()
    for pattern in _HARD_BLOCK_PATTERNS:
        if pattern in lower:
            return False, f"Blocked pattern detected: '{pattern}'"
    return True, ""


# ---------------------------------------------------------------------------
# Generator
# ---------------------------------------------------------------------------

SYSTEM_PROMPT = """You are a professional social media script writer for AI-powered influencers.
Write engaging, platform-appropriate content that:
- Hooks the audience within the first 3 seconds
- Maintains the persona's consistent tone and voice throughout
- Includes natural emotional variation between segments
- Ends with a clear, actionable call-to-action
- Never claims the speaker is a real human
- Always stays within the persona's defined content boundaries

IMPORTANT: You must output ONLY valid JSON. No markdown, no commentary — pure JSON."""


class ScriptGenerator:
    """
    LLM-driven script generator.

    Primary provider: Anthropic Claude (claude-opus-4-6)
    Fallback:         OpenAI GPT-4o

    Usage:
        gen = ScriptGenerator(provider="anthropic")
        script = gen.generate(
            persona_name="Alex Tech",
            niche="tech reviews",
            tone="energetic and confident",
            topic="Top 5 AI tools of 2025",
            platform="tiktok",
            target_duration=60,
            persona_id="alex_tech",
        )
        print(script.full_text)
    """

    def __init__(self, provider: str = "anthropic"):
        if provider not in ("anthropic", "openai"):
            raise ValueError("provider must be 'anthropic' or 'openai'")
        self.provider = provider
        self._client = None

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def generate(
        self,
        persona_name: str,
        niche: str,
        tone: str,
        topic: str,
        platform: str,
        target_duration: int = 60,
        persona_id: str = "",
        extra_context: str = "",
    ) -> Script:
        """
        Generate a complete script.

        Args:
            persona_name: Display name of the AI influencer.
            niche:        Content category (e.g. "fitness", "tech", "finance").
            tone:         Free-text tone descriptor fed into the prompt.
            topic:        What this piece of content is about.
            platform:     Target platform (tiktok | youtube | instagram | ...).
            target_duration: Target video length in seconds.
            persona_id:   ID string for Script metadata.
            extra_context: Optional additional instructions injected into prompt.

        Returns:
            Script object with segments and full text.

        Raises:
            RuntimeError: If both primary and fallback providers fail.
            ValueError:   If the output fails the safety filter.
        """
        # Pre-generation safety check on topic
        passed, reason = _safety_check(topic + " " + extra_context)
        if not passed:
            raise ValueError(f"Safety filter blocked this request: {reason}")

        prompt = self._build_prompt(
            persona_name, niche, tone, topic, platform,
            target_duration, extra_context,
        )

        raw, tokens = self._call_with_fallback(prompt)

        # Post-generation safety check
        passed, reason = _safety_check(raw)
        if not passed:
            raise ValueError(f"Safety filter rejected generated script: {reason}")

        return self._parse_response(raw, tokens, persona_id, persona_name, platform, topic)

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _call_with_fallback(self, prompt: str) -> tuple[str, int]:
        try:
            return self._call_llm(prompt, self.provider)
        except Exception as primary_err:
            fallback = "openai" if self.provider == "anthropic" else "anthropic"
            print(
                f"[ScriptGenerator] {self.provider} failed ({primary_err}). "
                f"Falling back to {fallback}."
            )
            try:
                return self._call_llm(prompt, fallback)
            except Exception as fallback_err:
                raise RuntimeError(
                    f"Both LLM providers failed.\n"
                    f"  Primary ({self.provider}): {primary_err}\n"
                    f"  Fallback ({fallback}): {fallback_err}"
                ) from fallback_err

    def _call_llm(self, prompt: str, provider: str) -> tuple[str, int]:
        if provider == "anthropic":
            import anthropic
            client = anthropic.Anthropic(
                api_key=os.environ["ANTHROPIC_API_KEY"]
            )
            response = client.messages.create(
                model="claude-opus-4-6",
                max_tokens=2048,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": prompt}],
            )
            text = response.content[0].text
            tokens = response.usage.input_tokens + response.usage.output_tokens
            return text, tokens

        elif provider == "openai":
            import openai
            client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
            response = client.chat.completions.create(
                model="gpt-4o",
                messages=[
                    {"role": "system", "content": SYSTEM_PROMPT},
                    {"role": "user", "content": prompt},
                ],
                max_tokens=2048,
                response_format={"type": "json_object"},
            )
            text = response.choices[0].message.content
            tokens = response.usage.total_tokens
            return text, tokens

        else:
            raise ValueError(f"Unknown provider: {provider}")

    def _build_prompt(
        self,
        persona_name: str,
        niche: str,
        tone: str,
        topic: str,
        platform: str,
        target_duration: int,
        extra_context: str,
    ) -> str:
        platform_hints = {
            "tiktok":    "High energy, fast pacing, hook in first 2 seconds, max 60s.",
            "youtube":   "More detail allowed, conversational, max 10 minutes for long-form.",
            "instagram": "Visually descriptive, aspirational tone, max 90s for Reels.",
            "twitter":   "Punchy, concise, 2 minutes max.",
            "linkedin":  "Professional, value-focused, 3-5 minutes.",
        }
        hint = platform_hints.get(platform.lower(), "Engaging and platform-appropriate.")

        return f"""Generate a {platform} video script for the AI influencer "{persona_name}".

Persona details:
- Niche: {niche}
- Tone: {tone}
- Platform: {platform} — {hint}
- Target duration: {target_duration} seconds

Topic: {topic}
{f'Additional context: {extra_context}' if extra_context else ''}

Return ONLY this JSON structure (no markdown fences, no extra keys):
{{
  "segments": [
    {{
      "type": "hook",
      "text": "<opening 3-second hook>",
      "duration_hint": 4.0,
      "emotion_cue": "excited"
    }},
    {{
      "type": "body",
      "text": "<main content>",
      "duration_hint": 40.0,
      "emotion_cue": "confident"
    }},
    {{
      "type": "transition",
      "text": "<brief pivot or pause line>",
      "duration_hint": 3.0,
      "emotion_cue": "curious"
    }},
    {{
      "type": "cta",
      "text": "<call to action>",
      "duration_hint": 5.0,
      "emotion_cue": "excited"
    }}
  ]
}}

Valid emotion_cue values: neutral, excited, confident, curious, empathetic, amused, serious
Valid segment types:      hook, body, transition, cta"""

    def _parse_response(
        self,
        raw: str,
        tokens: int,
        persona_id: str,
        persona_name: str,
        platform: str,
        topic: str,
    ) -> Script:
        # Strip potential markdown fences if provider added them anyway
        raw = raw.strip()
        if raw.startswith("```"):
            raw = raw.split("```")[1]
            if raw.startswith("json"):
                raw = raw[4:]
            raw = raw.strip()

        try:
            data = json.loads(raw)
        except json.JSONDecodeError as exc:
            raise RuntimeError(
                f"LLM returned invalid JSON: {exc}\nRaw output:\n{raw}"
            ) from exc

        segments = [
            ScriptSegment(
                type=s.get("type", "body"),
                text=s.get("text", ""),
                duration_hint=float(s.get("duration_hint", 5.0)),
                emotion_cue=s.get("emotion_cue", "neutral"),
            )
            for s in data.get("segments", [])
        ]

        full_text = " ".join(s.text for s in segments)
        estimated_duration = sum(s.duration_hint for s in segments)

        return Script(
            persona_id=persona_id,
            persona_name=persona_name,
            platform=platform,
            topic=topic,
            segments=segments,
            full_text=full_text,
            estimated_duration=round(estimated_duration, 1),
            llm_provider=self.provider,
            tokens_used=tokens,
            safety_passed=True,
        )
