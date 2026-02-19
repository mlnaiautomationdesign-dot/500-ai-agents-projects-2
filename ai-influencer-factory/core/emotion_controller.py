"""
Emotion Controller
------------------
Accepts script text, detects emotional segments via keyword/LLM analysis,
maps each segment to animation parameters, and outputs an emotion vector
timeline for use by the avatar rendering pipeline.
"""

import re
from dataclasses import dataclass, field
from enum import Enum
from typing import Optional


class EmotionLabel(str, Enum):
    JOY = "joy"
    SADNESS = "sadness"
    ANGER = "anger"
    FEAR = "fear"
    SURPRISE = "surprise"
    DISGUST = "disgust"
    CALM = "calm"
    EXCITEMENT = "excitement"
    EMPATHY = "empathy"
    INSPIRATION = "inspiration"
    NEUTRAL = "neutral"


@dataclass
class EmotionVector:
    """
    A single point in the emotion timeline.

    valence:   -1.0 (very negative) to +1.0 (very positive)
    arousal:    0.0 (calm) to 1.0 (highly energized)
    dominance:  0.0 (passive) to 1.0 (assertive/dominant)
    label:      Closest discrete emotion label
    """
    label: EmotionLabel
    valence: float        # -1.0 to +1.0
    arousal: float        # 0.0 to 1.0
    dominance: float      # 0.0 to 1.0

    # Animation parameter mappings (0.0–1.0 scale)
    brow_raise: float = 0.0
    smile_intensity: float = 0.0
    eye_openness: float = 0.5
    head_tilt: float = 0.0           # -1.0 = left, +1.0 = right
    speech_rate_modifier: float = 1.0  # multiplier on base WPM


@dataclass
class EmotionSegment:
    """A text segment annotated with its emotion vector."""
    text: str
    start_char: int
    end_char: int
    vector: EmotionVector


@dataclass
class EmotionTimeline:
    """
    Ordered sequence of EmotionSegments covering the full script.
    Consumed by the avatar renderer to drive facial animation.
    """
    segments: list[EmotionSegment] = field(default_factory=list)

    def to_keyframes(self) -> list[dict]:
        """
        Export timeline as a list of keyframe dicts suitable for
        animation systems (Blender, Live2D, SadTalker, etc.).
        """
        return [
            {
                "start_char": seg.start_char,
                "end_char": seg.end_char,
                "text": seg.text,
                "label": seg.vector.label.value,
                "valence": seg.vector.valence,
                "arousal": seg.vector.arousal,
                "dominance": seg.vector.dominance,
                "animation": {
                    "brow_raise": seg.vector.brow_raise,
                    "smile_intensity": seg.vector.smile_intensity,
                    "eye_openness": seg.vector.eye_openness,
                    "head_tilt": seg.vector.head_tilt,
                    "speech_rate_modifier": seg.vector.speech_rate_modifier,
                },
            }
            for seg in self.segments
        ]


# ── VAD and animation lookup tables ──────────────────────────────────────────

# (valence, arousal, dominance, brow_raise, smile, eye_open, head_tilt, rate)
_EMOTION_PARAMS: dict[EmotionLabel, tuple] = {
    EmotionLabel.JOY:         ( 0.9,  0.7, 0.7, 0.2, 0.9, 0.7,  0.10, 1.05),
    EmotionLabel.SADNESS:     (-0.7,  0.3, 0.3, 0.0, 0.0, 0.3, -0.10, 0.85),
    EmotionLabel.ANGER:       (-0.5,  0.9, 0.8, 0.0, 0.0, 0.8,  0.00, 1.20),
    EmotionLabel.FEAR:        (-0.6,  0.8, 0.2, 0.9, 0.0, 0.9, -0.20, 1.10),
    EmotionLabel.SURPRISE:    ( 0.1,  0.9, 0.5, 1.0, 0.3, 1.0,  0.00, 1.15),
    EmotionLabel.DISGUST:     (-0.6,  0.5, 0.6, 0.1, 0.0, 0.4,  0.00, 0.95),
    EmotionLabel.CALM:        ( 0.4,  0.1, 0.5, 0.0, 0.3, 0.4,  0.00, 0.85),
    EmotionLabel.EXCITEMENT:  ( 0.8,  0.9, 0.7, 0.5, 0.8, 0.8,  0.10, 1.20),
    EmotionLabel.EMPATHY:     ( 0.5,  0.4, 0.5, 0.2, 0.4, 0.5, -0.10, 0.90),
    EmotionLabel.INSPIRATION: ( 0.8,  0.6, 0.7, 0.3, 0.6, 0.6,  0.05, 1.00),
    EmotionLabel.NEUTRAL:     ( 0.0,  0.3, 0.5, 0.0, 0.1, 0.5,  0.00, 1.00),
}


def _build_vector(label: EmotionLabel) -> EmotionVector:
    p = _EMOTION_PARAMS.get(label, _EMOTION_PARAMS[EmotionLabel.NEUTRAL])
    return EmotionVector(
        label=label,
        valence=p[0], arousal=p[1], dominance=p[2],
        brow_raise=p[3], smile_intensity=p[4], eye_openness=p[5],
        head_tilt=p[6], speech_rate_modifier=p[7],
    )


# ── Rule-based keyword detector ───────────────────────────────────────────────

_KEYWORD_MAP: dict[EmotionLabel, list[str]] = {
    EmotionLabel.JOY: ["happy", "love", "amazing", "wonderful", "great", "fantastic", "joy", "smile", "laugh"],
    EmotionLabel.SADNESS: ["sad", "miss", "cry", "lost", "alone", "hurt", "pain", "grief", "sorry", "disappointed"],
    EmotionLabel.ANGER: ["angry", "frustrated", "furious", "hate", "ridiculous", "unacceptable", "outrage", "enough"],
    EmotionLabel.FEAR: ["afraid", "scared", "worry", "anxious", "nervous", "fear", "dread", "panic", "terrified"],
    EmotionLabel.SURPRISE: ["wow", "unbelievable", "shocking", "incredible", "suddenly", "unexpected", "wait"],
    EmotionLabel.EXCITEMENT: ["can't wait", "thrilled", "pumped", "fired up", "let's go", "this is huge"],
    EmotionLabel.EMPATHY: ["I understand", "I hear you", "feel you", "been there", "you're not alone", "together"],
    EmotionLabel.INSPIRATION: ["imagine", "possible", "believe", "dream", "transform", "potential", "achieve"],
    EmotionLabel.CALM: ["breathe", "relax", "peace", "gentle", "slowly", "take your time", "comfortable"],
    EmotionLabel.DISGUST: ["disgusting", "terrible", "awful", "gross", "revolting", "despicable"],
}


def _rule_detect(sentence: str) -> EmotionLabel:
    lower = sentence.lower()
    scores: dict[EmotionLabel, int] = {lbl: 0 for lbl in EmotionLabel}
    for label, keywords in _KEYWORD_MAP.items():
        for kw in keywords:
            if kw in lower:
                scores[label] += 1
    best = max(scores, key=lambda l: scores[l])
    return best if scores[best] > 0 else EmotionLabel.NEUTRAL


# ── EmotionController ─────────────────────────────────────────────────────────

class EmotionController:
    """
    Segments a script into sentences, detects the emotion of each segment,
    maps it to animation parameters, and returns an EmotionTimeline.

    Modes:
      "rule" (default) — keyword-based, zero latency, no API calls
      "llm"            — GPT-4o-mini for richer context-aware detection
    """

    def __init__(self, mode: str = "rule") -> None:
        if mode not in ("rule", "llm"):
            raise ValueError("mode must be 'rule' or 'llm'")
        self.mode = mode

    def analyze(self, script_text: str) -> EmotionTimeline:
        """
        Process script_text and return an EmotionTimeline with one
        EmotionSegment per sentence, each annotated with a full EmotionVector.
        """
        sentences = self._split_sentences(script_text)
        timeline = EmotionTimeline()
        cursor = 0

        for sentence in sentences:
            start = script_text.find(sentence, cursor)
            end = start + len(sentence)

            label = (
                self._llm_detect(sentence)
                if self.mode == "llm"
                else _rule_detect(sentence)
            )

            timeline.segments.append(
                EmotionSegment(
                    text=sentence,
                    start_char=start,
                    end_char=end,
                    vector=_build_vector(label),
                )
            )
            cursor = end

        return timeline

    def _split_sentences(self, text: str) -> list[str]:
        parts = re.split(r'(?<=[.!?])\s+', text.strip())
        return [p.strip() for p in parts if p.strip()]

    def _llm_detect(self, sentence: str) -> EmotionLabel:
        import os
        import openai
        labels = [e.value for e in EmotionLabel]
        client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        prompt = (
            f"Classify the primary emotion in this sentence.\n"
            f'Sentence: "{sentence}"\n'
            f"Choose one from: {', '.join(labels)}.\n"
            f"Reply with the label only."
        )
        resp = client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[{"role": "user", "content": prompt}],
            max_tokens=10,
            temperature=0,
        )
        raw = resp.choices[0].message.content.strip().lower()
        try:
            return EmotionLabel(raw)
        except ValueError:
            return EmotionLabel.NEUTRAL
