"""
Emotion Controller
==================
Accepts script text, detects emotional segments using keyword + punctuation
heuristics, maps each segment to animation parameters, and returns a
time-coded emotion vector timeline consumed by the Avatar Pipeline.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from typing import Optional


# ---------------------------------------------------------------------------
# Data models
# ---------------------------------------------------------------------------

@dataclass
class EmotionVector:
    """
    Normalized emotion scores (0.0–1.0) for a single script segment.
    All values default to 0.0 (neutral/absent).
    """
    joy: float = 0.0
    confidence: float = 0.0
    curiosity: float = 0.0
    empathy: float = 0.0
    excitement: float = 0.0
    seriousness: float = 0.0

    def dominant(self) -> str:
        """Return the name of the strongest emotion."""
        scores = {
            "joy": self.joy,
            "confidence": self.confidence,
            "curiosity": self.curiosity,
            "empathy": self.empathy,
            "excitement": self.excitement,
            "seriousness": self.seriousness,
        }
        return max(scores, key=scores.get)  # type: ignore[arg-type]

    def magnitude(self) -> float:
        """Mean of non-zero emotion scores; 0.0 if all neutral."""
        active = [v for v in vars(self).values() if isinstance(v, float) and v > 0]
        return round(sum(active) / len(active), 3) if active else 0.0


@dataclass
class AnimationParams:
    """
    Blendshape-level animation parameters derived from an EmotionVector.
    Maps directly to facial rig controls (ARKit-compatible naming).
    """
    brow_raise: float = 0.0         # Eyebrow elevation
    mouth_smile: float = 0.0        # Lip corner pull
    eye_widen: float = 0.0          # Eye aperture
    head_tilt: float = 0.0          # Lateral head tilt (radians)
    nod_rate: float = 0.0           # Nodding frequency (0=none, 1=frequent)
    blink_rate: float = 0.15        # Blinks per second (baseline 0.15)
    jaw_drop: float = 0.0           # Jaw openness for surprise/awe


@dataclass
class EmotionSegment:
    """A single time-coded segment of the script with its emotion and animation data."""
    text: str
    start_word: int
    end_word: int
    timestamp_start: float          # Seconds from start of audio
    timestamp_end: float
    emotion: EmotionVector
    animation: AnimationParams
    intensity: float                # Overall emotional intensity 0.0–1.0


# ---------------------------------------------------------------------------
# Controller
# ---------------------------------------------------------------------------

class EmotionController:
    """
    Converts a raw script string into a time-indexed emotion vector timeline.

    The detection is purely heuristic (keyword + punctuation matching), making
    it dependency-free and fast. For higher accuracy, replace `_score_text`
    with an ML-based sentiment classifier.

    Usage:
        controller = EmotionController(words_per_minute=150)
        timeline = controller.process(script_text)
        dicts = controller.to_dict(timeline)
    """

    # Keyword → emotion mapping
    EMOTION_KEYWORDS: dict[str, list[str]] = {
        "joy": [
            "happy", "love", "great", "wonderful", "amazing", "fantastic",
            "joy", "glad", "delighted", "grateful", "beautiful", "awesome",
        ],
        "confidence": [
            "absolutely", "definitely", "proven", "results", "success",
            "achieve", "master", "guarantee", "certain", "trust", "expert",
        ],
        "curiosity": [
            "wonder", "interesting", "imagine", "what if", "how", "why",
            "discover", "explore", "question", "think about", "ever noticed",
        ],
        "empathy": [
            "understand", "feel", "relate", "know how it feels", "struggle",
            "challenge", "hard time", "difficult", "support", "here for you",
        ],
        "excitement": [
            "incredible", "unbelievable", "wow", "game-changer", "huge",
            "massive", "revolutionary", "mind-blowing", "can't wait", "finally",
        ],
        "seriousness": [
            "important", "critical", "must", "need to", "serious", "warning",
            "attention", "listen", "pay attention", "stop", "remember",
        ],
    }

    # Punctuation signals
    PUNCTUATION_DELTAS: dict[str, dict[str, float]] = {
        "!":   {"excitement": 0.25, "joy": 0.10},
        "?":   {"curiosity": 0.25},
        "...": {"empathy": 0.10, "seriousness": 0.10},
    }

    # Uppercase words often signal emphasis → boost excitement/confidence
    CAPS_BOOST = 0.15

    def __init__(
        self,
        words_per_minute: int = 150,
        baseline: Optional[dict[str, float]] = None,
    ):
        self.wpm = max(60, min(300, words_per_minute))
        self._spw = 60.0 / self.wpm  # seconds per word
        self._baseline = baseline or {}

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def process(self, script_text: str) -> list[EmotionSegment]:
        """
        Parse script_text into time-coded EmotionSegments.

        Args:
            script_text: Full script as a plain string.

        Returns:
            Ordered list of EmotionSegment objects covering the entire script.
        """
        segments_text = self._split_segments(script_text)
        timeline: list[EmotionSegment] = []
        word_cursor = 0
        time_cursor = 0.0

        for seg_text in segments_text:
            words = seg_text.split()
            word_count = max(1, len(words))
            duration = word_count * self._spw

            vec = self._score_text(seg_text)
            intensity = vec.magnitude()
            anim = self._map_to_animation(vec, intensity)

            timeline.append(EmotionSegment(
                text=seg_text,
                start_word=word_cursor,
                end_word=word_cursor + word_count,
                timestamp_start=round(time_cursor, 3),
                timestamp_end=round(time_cursor + duration, 3),
                emotion=vec,
                animation=anim,
                intensity=round(intensity, 3),
            ))
            word_cursor += word_count
            time_cursor += duration

        return timeline

    def to_dict(self, timeline: list[EmotionSegment]) -> list[dict]:
        """Serialise a timeline to a list of plain dicts (JSON-safe)."""
        return [
            {
                "text": seg.text,
                "timestamp": {
                    "start": seg.timestamp_start,
                    "end": seg.timestamp_end,
                },
                "emotion": {
                    "joy":         round(seg.emotion.joy, 3),
                    "confidence":  round(seg.emotion.confidence, 3),
                    "curiosity":   round(seg.emotion.curiosity, 3),
                    "empathy":     round(seg.emotion.empathy, 3),
                    "excitement":  round(seg.emotion.excitement, 3),
                    "seriousness": round(seg.emotion.seriousness, 3),
                    "dominant":    seg.emotion.dominant(),
                },
                "animation": {
                    "brow_raise":  round(seg.animation.brow_raise, 3),
                    "mouth_smile": round(seg.animation.mouth_smile, 3),
                    "eye_widen":   round(seg.animation.eye_widen, 3),
                    "head_tilt":   round(seg.animation.head_tilt, 3),
                    "nod_rate":    round(seg.animation.nod_rate, 3),
                    "blink_rate":  round(seg.animation.blink_rate, 3),
                    "jaw_drop":    round(seg.animation.jaw_drop, 3),
                },
                "intensity": seg.intensity,
            }
            for seg in timeline
        ]

    def total_duration(self, timeline: list[EmotionSegment]) -> float:
        """Return the estimated total audio duration in seconds."""
        if not timeline:
            return 0.0
        return timeline[-1].timestamp_end

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _split_segments(self, text: str) -> list[str]:
        """Split on sentence boundaries; preserve punctuation."""
        parts = re.split(r'(?<=[.!?])\s+', text.strip())
        return [p.strip() for p in parts if p.strip()]

    def _score_text(self, text: str) -> EmotionVector:
        text_lower = text.lower()
        scores: dict[str, float] = {k: self._baseline.get(k, 0.0)
                                     for k in EmotionVector.__dataclass_fields__}

        # Keyword matching
        for emotion, keywords in self.EMOTION_KEYWORDS.items():
            for kw in keywords:
                if kw in text_lower:
                    scores[emotion] = min(1.0, scores[emotion] + 0.25)

        # Punctuation signals
        for punct, deltas in self.PUNCTUATION_DELTAS.items():
            if punct in text:
                for emotion, delta in deltas.items():
                    scores[emotion] = min(1.0, scores[emotion] + delta)

        # ALL-CAPS words → excitement/confidence boost
        caps_words = re.findall(r'\b[A-Z]{2,}\b', text)
        if caps_words:
            cap_boost = min(self.CAPS_BOOST * len(caps_words), 0.4)
            scores["excitement"] = min(1.0, scores["excitement"] + cap_boost)
            scores["confidence"] = min(1.0, scores["confidence"] + cap_boost * 0.5)

        return EmotionVector(**scores)

    def _map_to_animation(self, vec: EmotionVector, intensity: float) -> AnimationParams:
        """Translate an EmotionVector into facial animation parameters."""
        return AnimationParams(
            brow_raise=min(1.0, (vec.excitement + vec.curiosity) * 0.6 * intensity),
            mouth_smile=min(1.0, (vec.joy + vec.excitement * 0.4) * intensity),
            eye_widen=min(1.0, (vec.excitement + vec.curiosity * 0.5) * intensity),
            head_tilt=min(0.4, vec.curiosity * 0.45 * intensity),
            nod_rate=min(1.0, (vec.confidence + vec.empathy * 0.3) * intensity),
            blink_rate=max(0.05, 0.15 - vec.excitement * 0.06),
            jaw_drop=min(0.6, vec.excitement * 0.5 * intensity),
        )
