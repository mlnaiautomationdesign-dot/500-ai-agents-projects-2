"""
Persona Engine
--------------
Loads persona profiles from JSON config.
Controls tone, baseline emotion, and pacing.
Outputs a PersonaProfile object used by all downstream modules.
"""

import json
from dataclasses import dataclass, field
from typing import Optional


@dataclass
class ToneConfig:
    """Controls how the persona expresses itself linguistically."""
    formality: float = 0.5        # 0.0 = very casual, 1.0 = very formal
    warmth: float = 0.7           # 0.0 = cold/detached, 1.0 = warm/personal
    confidence: float = 0.8       # 0.0 = hesitant, 1.0 = assertive
    humor: float = 0.3            # 0.0 = serious, 1.0 = playful/humorous
    vocabulary_level: str = "accessible"  # simple / accessible / technical


@dataclass
class EmotionBaseline:
    """Defines the resting emotional state of the persona."""
    valence: float = 0.7          # 0.0 = negative, 1.0 = positive
    arousal: float = 0.6          # 0.0 = calm, 1.0 = energized
    dominance: float = 0.6        # 0.0 = submissive, 1.0 = dominant
    primary_emotion: str = "inspired"  # e.g. happy, calm, excited, empathetic


@dataclass
class PacingConfig:
    """Controls the rhythm and tempo of speech and content delivery."""
    words_per_minute: int = 145   # spoken delivery speed target
    pause_frequency: str = "medium"  # low / medium / high (between phrases)
    sentence_length: str = "mixed"   # short / medium / long / mixed
    hook_position: str = "opening"   # opening / middle — where to place the hook


@dataclass
class PersonaProfile:
    """
    Complete persona profile object output by PersonaEngine.
    Used by ScriptGenerator, EmotionController, and AvatarRenderer.
    """
    name: str
    niche: str
    voice_style: str
    brand_tone: str
    language: str
    audience_age_range: tuple[int, int]
    avatar_style: str
    tags: list[str]
    tone: ToneConfig
    emotion_baseline: EmotionBaseline
    pacing: PacingConfig

    def to_system_prompt_context(self) -> str:
        """Serialize key persona attributes for injection into LLM system prompts."""
        age_min, age_max = self.audience_age_range
        return (
            f"Persona: {self.name}\n"
            f"Niche: {self.niche}\n"
            f"Voice Style: {self.voice_style}\n"
            f"Brand Tone: {self.brand_tone}\n"
            f"Target Audience Age: {age_min}–{age_max}\n"
            f"Tone — Formality: {self.tone.formality:.1f}, "
            f"Warmth: {self.tone.warmth:.1f}, "
            f"Confidence: {self.tone.confidence:.1f}\n"
            f"Emotional Baseline: {self.emotion_baseline.primary_emotion} "
            f"(valence={self.emotion_baseline.valence:.1f}, "
            f"arousal={self.emotion_baseline.arousal:.1f})\n"
            f"Pacing: ~{self.pacing.words_per_minute} WPM, "
            f"{self.pacing.sentence_length} sentences\n"
        )


class PersonaEngine:
    """
    Loads and manages influencer persona profiles from a JSON config file.
    Each persona entry is parsed into a fully typed PersonaProfile object.
    """

    def __init__(self, config_path: str = "configs/personas.json") -> None:
        self.config_path = config_path
        self._profiles: dict[str, PersonaProfile] = {}

    def load(self) -> None:
        """
        Load all personas from the JSON config.
        Each entry may include optional tone, emotion_baseline, and pacing blocks.
        Missing blocks are populated with defaults.
        """
        with open(self.config_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        for entry in data.get("personas", []):
            profile = self._parse_entry(entry)
            self._profiles[profile.name] = profile

    def _parse_entry(self, entry: dict) -> PersonaProfile:
        tone_data = entry.get("tone", {})
        emotion_data = entry.get("emotion_baseline", {})
        pacing_data = entry.get("pacing", {})

        age_range = entry.get("audience_age_range", [18, 35])

        return PersonaProfile(
            name=entry["name"],
            niche=entry["niche"],
            voice_style=entry["voice_style"],
            brand_tone=entry["brand_tone"],
            language=entry.get("language", "en"),
            audience_age_range=(age_range[0], age_range[1]),
            avatar_style=entry.get("avatar_style", "photorealistic"),
            tags=entry.get("tags", []),
            tone=ToneConfig(
                formality=tone_data.get("formality", 0.5),
                warmth=tone_data.get("warmth", 0.7),
                confidence=tone_data.get("confidence", 0.8),
                humor=tone_data.get("humor", 0.3),
                vocabulary_level=tone_data.get("vocabulary_level", "accessible"),
            ),
            emotion_baseline=EmotionBaseline(
                valence=emotion_data.get("valence", 0.7),
                arousal=emotion_data.get("arousal", 0.6),
                dominance=emotion_data.get("dominance", 0.6),
                primary_emotion=emotion_data.get("primary_emotion", "inspired"),
            ),
            pacing=PacingConfig(
                words_per_minute=pacing_data.get("words_per_minute", 145),
                pause_frequency=pacing_data.get("pause_frequency", "medium"),
                sentence_length=pacing_data.get("sentence_length", "mixed"),
                hook_position=pacing_data.get("hook_position", "opening"),
            ),
        )

    def get(self, name: str) -> PersonaProfile:
        if name not in self._profiles:
            raise KeyError(f"Persona '{name}' not found. Call load() first.")
        return self._profiles[name]

    def list_personas(self) -> list[str]:
        return list(self._profiles.keys())

    def create(
        self,
        name: str,
        niche: str,
        voice_style: str,
        brand_tone: str,
        audience_age_range: tuple[int, int] = (18, 35),
        language: str = "en",
        avatar_style: str = "photorealistic",
        tags: Optional[list[str]] = None,
        tone: Optional[ToneConfig] = None,
        emotion_baseline: Optional[EmotionBaseline] = None,
        pacing: Optional[PacingConfig] = None,
    ) -> PersonaProfile:
        """Programmatically create and register a new persona profile."""
        profile = PersonaProfile(
            name=name,
            niche=niche,
            voice_style=voice_style,
            brand_tone=brand_tone,
            language=language,
            audience_age_range=audience_age_range,
            avatar_style=avatar_style,
            tags=tags or [],
            tone=tone or ToneConfig(),
            emotion_baseline=emotion_baseline or EmotionBaseline(),
            pacing=pacing or PacingConfig(),
        )
        self._profiles[name] = profile
        return profile
