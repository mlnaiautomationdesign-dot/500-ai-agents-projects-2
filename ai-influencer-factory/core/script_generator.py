"""
Script Generator
----------------
LLM-driven module that produces scripts, captions, hooks,
and hashtags tailored to a given persona and emotion profile.
"""

import os
from typing import Optional

from core.persona_engine import Persona
from core.emotion_controller import EmotionController


SYSTEM_PROMPT_TEMPLATE = """
You are a professional content strategist and scriptwriter.
You are writing on behalf of an AI influencer with the following profile:

Name: {name}
Niche: {niche}
Voice Style: {voice_style}
Brand Tone: {brand_tone}
Target Audience Age: {age_range}

{emotion_modifier}

Always stay in character. Never break the fourth wall or reveal AI authorship
unless explicitly instructed.
""".strip()


class ScriptGenerator:
    """
    Generates scripts and captions using an LLM backend.
    Integrates persona identity and emotion profile into every prompt.
    """

    def __init__(
        self,
        persona: Persona,
        emotion_controller: EmotionController,
        model: str = "gpt-4o",
        max_tokens: int = 1024,
    ) -> None:
        self.persona = persona
        self.emotion_controller = emotion_controller
        self.model = model
        self.max_tokens = max_tokens
        self._client = None

    def _get_client(self):
        if self._client is None:
            import openai
            self._client = openai.OpenAI(api_key=os.environ["OPENAI_API_KEY"])
        return self._client

    def _build_system_prompt(self) -> str:
        age_min, age_max = self.persona.audience_age_range
        return SYSTEM_PROMPT_TEMPLATE.format(
            name=self.persona.name,
            niche=self.persona.niche,
            voice_style=self.persona.voice_style,
            brand_tone=self.persona.brand_tone,
            age_range=f"{age_min}-{age_max}",
            emotion_modifier=self.emotion_controller.get_prompt_modifier(),
        )

    def generate_script(
        self,
        topic: str,
        platform: str = "youtube",
        duration_seconds: Optional[int] = 60,
    ) -> str:
        """
        Generate a video/audio script for the given topic and platform.

        Args:
            topic: The subject matter of the content.
            platform: Target platform (youtube, tiktok, instagram, twitter).
            duration_seconds: Approximate spoken duration to target.

        Returns:
            The generated script as a string.
        """
        client = self._get_client()
        user_prompt = (
            f"Write a {duration_seconds}-second script for {platform} about: {topic}. "
            f"Include a strong hook in the first 3 seconds, the main value in the middle, "
            f"and a clear call to action at the end."
        )
        response = client.chat.completions.create(
            model=self.model,
            max_tokens=self.max_tokens,
            messages=[
                {"role": "system", "content": self._build_system_prompt()},
                {"role": "user", "content": user_prompt},
            ],
        )
        return response.choices[0].message.content

    def generate_caption(self, topic: str, platform: str = "instagram") -> str:
        """Generate a social media caption with hashtags."""
        client = self._get_client()
        user_prompt = (
            f"Write a {platform} caption for content about: {topic}. "
            f"Include 5-10 relevant hashtags at the end."
        )
        response = client.chat.completions.create(
            model=self.model,
            max_tokens=300,
            messages=[
                {"role": "system", "content": self._build_system_prompt()},
                {"role": "user", "content": user_prompt},
            ],
        )
        return response.choices[0].message.content
