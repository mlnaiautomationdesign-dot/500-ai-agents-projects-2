"""
Persona Engine
==============
Loads AI influencer personas from JSON config, controls tone, baseline emotion,
and pacing. Returns a structured PersonaProfile object consumed by all other modules.
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
class ToneProfile:
    """Defines the stylistic voice of a persona."""
    formality: float = 0.5      # 0.0 = very casual, 1.0 = very formal
    energy: float = 0.6         # 0.0 = calm/slow, 1.0 = high-energy/fast
    humor: float = 0.3          # 0.0 = serious, 1.0 = comedic
    warmth: float = 0.7         # 0.0 = detached, 1.0 = highly empathetic
    confidence: float = 0.8     # 0.0 = tentative, 1.0 = assertive


@dataclass
class EmotionBaseline:
    """Starting emotional state used to seed the Emotion Controller."""
    joy: float = 0.5
    confidence: float = 0.6
    curiosity: float = 0.5
    empathy: float = 0.5
    excitement: float = 0.4
    seriousness: float = 0.3


@dataclass
class PacingConfig:
    """Controls speech rhythm and delivery timing."""
    words_per_minute: int = 150         # Target speech rate
    pause_between_segments: float = 0.4 # Seconds of silence between script segments
    emphasis_rate: float = 0.12         # Fraction of words that receive emphasis
    trailing_silence_seconds: float = 0.8  # Silence appended after last word


@dataclass
class SafetyConfig:
    """Per-persona safety restrictions enforced before content generation."""
    allow_medical_topics: bool = False
    allow_financial_advice: bool = False
    allow_legal_topics: bool = False
    require_ai_disclosure: bool = True
    max_content_safety_score: float = 0.15  # Reject if toxicity > this threshold
    forbidden_keywords: list[str] = field(default_factory=list)


@dataclass
class PersonaProfile:
    """
    Complete definition of an AI influencer persona.
    This is the canonical object passed between all pipeline modules.
    """
    id: str
    name: str
    niche: str
    bio: str
    tone: ToneProfile
    baseline_emotion: EmotionBaseline
    pacing: PacingConfig
    safety_config: SafetyConfig

    # Avatar & voice assets
    avatar_image: str           # Path to source portrait image
    voice_id: str               # TTS provider voice identifier
    voice_provider: str = "elevenlabs"

    # Optional metadata
    target_platforms: list[str] = field(default_factory=list)
    language: str = "en"
    version: int = 1
    meta: dict = field(default_factory=dict)


# ---------------------------------------------------------------------------
# Engine
# ---------------------------------------------------------------------------

class PersonaEngine:
    """
    Loads, validates, and retrieves persona profiles from a JSON config file.

    Usage:
        engine = PersonaEngine("configs/personas.json")
        profile = engine.load("alex_tech")
        print(profile.name, profile.tone.energy)
    """

    def __init__(self, config_path: str = "configs/personas.json"):
        self.config_path = config_path
        self._personas: dict[str, PersonaProfile] = {}
        self._load_all()

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def load(self, persona_id: str) -> PersonaProfile:
        """
        Return the PersonaProfile for the given ID.

        Raises:
            ValueError: If the persona ID is not found in the config.
        """
        if persona_id not in self._personas:
            available = list(self._personas.keys())
            raise ValueError(
                f"Persona '{persona_id}' not found. "
                f"Available: {available}"
            )
        return self._personas[persona_id]

    def list_personas(self) -> list[str]:
        """Return all registered persona IDs."""
        return list(self._personas.keys())

    def reload(self) -> None:
        """Re-read the config file from disk (e.g. after a live edit)."""
        self._personas.clear()
        self._load_all()

    def describe(self, persona_id: str) -> str:
        """Return a human-readable summary of a persona."""
        p = self.load(persona_id)
        return (
            f"Persona: {p.name} ({p.id})\n"
            f"  Niche:    {p.niche}\n"
            f"  Voice:    {p.voice_id} via {p.voice_provider}\n"
            f"  WPM:      {p.pacing.words_per_minute}\n"
            f"  Tone:     energy={p.tone.energy:.1f}, warmth={p.tone.warmth:.1f}, "
            f"humor={p.tone.humor:.1f}\n"
            f"  Platforms: {', '.join(p.target_platforms) or 'all'}\n"
            f"  Bio:      {p.bio[:80]}{'...' if len(p.bio) > 80 else ''}"
        )

    # ------------------------------------------------------------------
    # Internal
    # ------------------------------------------------------------------

    def _load_all(self) -> None:
        if not os.path.exists(self.config_path):
            return
        with open(self.config_path, "r", encoding="utf-8") as fh:
            data = json.load(fh)
        for entry in data.get("personas", []):
            profile = self._parse(entry)
            self._validate(profile)
            self._personas[profile.id] = profile

    def _parse(self, data: dict) -> PersonaProfile:
        tone = ToneProfile(**data.get("tone", {}))
        emotion = EmotionBaseline(**data.get("baseline_emotion", {}))
        pacing = PacingConfig(**data.get("pacing", {}))
        safety = SafetyConfig(**data.get("safety_config", {}))

        return PersonaProfile(
            id=data["id"],
            name=data["name"],
            niche=data.get("niche", "general"),
            bio=data.get("bio", ""),
            tone=tone,
            baseline_emotion=emotion,
            pacing=pacing,
            safety_config=safety,
            avatar_image=data.get("avatar_image", ""),
            voice_id=data.get("voice_id", "default"),
            voice_provider=data.get("voice_provider", "elevenlabs"),
            target_platforms=data.get("target_platforms", []),
            language=data.get("language", "en"),
            version=data.get("version", 1),
            meta=data.get("meta", {}),
        )

    def _validate(self, profile: PersonaProfile) -> None:
        """Enforce safety constraints at load time."""
        if not profile.id:
            raise ValueError("Persona 'id' must not be empty.")
        if not profile.name:
            raise ValueError(f"Persona '{profile.id}' is missing a name.")
        if not (0.0 <= profile.tone.energy <= 1.0):
            raise ValueError(f"Persona '{profile.id}': tone.energy must be 0.0–1.0.")
        if profile.pacing.words_per_minute < 60 or profile.pacing.words_per_minute > 300:
            raise ValueError(
                f"Persona '{profile.id}': words_per_minute must be 60–300."
            )
