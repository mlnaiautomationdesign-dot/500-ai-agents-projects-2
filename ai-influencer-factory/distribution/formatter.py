"""
Formatter
=========
Assembles platform-specific metadata payloads from script content and
persona data: titles, descriptions, hashtags, and scheduling fields.

Always appends AI disclosure in accordance with platform policies and
the safety boundaries defined in CLAUDE.md.
"""

from __future__ import annotations

import re
from dataclasses import dataclass, field
from datetime import datetime
from typing import Optional

from .exporter import Platform


# ---------------------------------------------------------------------------
# Output model
# ---------------------------------------------------------------------------

@dataclass
class PlatformPost:
    """
    Metadata payload ready to be submitted to a platform API or
    content scheduling tool.
    """
    platform: Platform
    title: str
    description: str
    hashtags: list[str]
    scheduled_at: Optional[datetime]
    ai_disclosure: str = "This content is AI-generated."
    is_paid_partnership: bool = False
    mentions: list[str] = field(default_factory=list)
    location: Optional[str] = None


# ---------------------------------------------------------------------------
# Platform constraints
# ---------------------------------------------------------------------------

_HASHTAG_LIMITS: dict[Platform, int] = {
    Platform.TIKTOK:    30,
    Platform.INSTAGRAM: 30,
    Platform.YOUTUBE:   15,
    Platform.TWITTER:   3,
    Platform.LINKEDIN:  5,
}

_DESC_CHAR_LIMITS: dict[Platform, int] = {
    Platform.TIKTOK:    2200,
    Platform.INSTAGRAM: 2200,
    Platform.YOUTUBE:   5000,
    Platform.TWITTER:   280,
    Platform.LINKEDIN:  3000,
}

_TITLE_CHAR_LIMITS: dict[Platform, int] = {
    Platform.TIKTOK:    100,
    Platform.INSTAGRAM: 100,
    Platform.YOUTUBE:   100,
    Platform.TWITTER:   100,   # Twitter uses description, not a separate title
    Platform.LINKEDIN:  200,
}

# Niche → suggested evergreen hashtags
_NICHE_HASHTAGS: dict[str, list[str]] = {
    "tech":     ["#TechTok", "#TechReview", "#AI", "#Gadgets"],
    "fitness":  ["#FitnessTok", "#WorkoutTips", "#HealthyLiving", "#Gym"],
    "finance":  ["#MoneyTips", "#PersonalFinance", "#FinanceTok", "#Investing"],
    "lifestyle": ["#LifestyleTok", "#DailyVlog", "#LifestyleTips"],
    "beauty":   ["#BeautyTok", "#Makeup", "#Skincare", "#GRWM"],
    "food":     ["#FoodTok", "#Recipes", "#Cooking", "#FoodReview"],
}


# ---------------------------------------------------------------------------
# Formatter
# ---------------------------------------------------------------------------

class Formatter:
    """
    Builds platform-specific metadata from script content and persona data.

    Usage:
        f = Formatter()
        post = f.format(
            script_text="Hey everyone! Today I'm breaking down...",
            persona_name="Alex Tech",
            niche="tech",
            platform=Platform.TIKTOK,
            custom_hashtags=["#AITools", "#Productivity"],
        )
        print(post.description)
    """

    # ------------------------------------------------------------------
    # Public API
    # ------------------------------------------------------------------

    def format(
        self,
        script_text: str,
        persona_name: str,
        niche: str,
        platform: Platform,
        custom_hashtags: list[str] | None = None,
        scheduled_at: datetime | None = None,
        is_paid_partnership: bool = False,
    ) -> PlatformPost:
        """
        Generate a PlatformPost metadata object for one platform.

        Args:
            script_text:        Full script text (used to derive title/description).
            persona_name:       AI influencer name.
            niche:              Content niche (tech, fitness, etc.).
            platform:           Target platform.
            custom_hashtags:    Additional hashtags to include (with or without #).
            scheduled_at:       Optional post scheduling datetime (UTC).
            is_paid_partnership: Whether to flag as sponsored content.

        Returns:
            PlatformPost with all metadata fields populated.
        """
        title = self._make_title(script_text, platform)
        hashtags = self._make_hashtags(niche, custom_hashtags or [], platform)
        description = self._make_description(
            script_text, hashtags, platform, is_paid_partnership
        )

        return PlatformPost(
            platform=platform,
            title=title,
            description=description,
            hashtags=hashtags,
            scheduled_at=scheduled_at,
            ai_disclosure="[AI-Generated Content — Created by an AI influencer]",
            is_paid_partnership=is_paid_partnership,
        )

    def format_all(
        self,
        script_text: str,
        persona_name: str,
        niche: str,
        platforms: list[Platform],
        custom_hashtags: list[str] | None = None,
        scheduled_at: datetime | None = None,
    ) -> list[PlatformPost]:
        """Convenience wrapper: format for multiple platforms at once."""
        return [
            self.format(
                script_text, persona_name, niche, p, custom_hashtags, scheduled_at
            )
            for p in platforms
        ]

    # ------------------------------------------------------------------
    # Internal helpers
    # ------------------------------------------------------------------

    def _make_title(self, script_text: str, platform: Platform) -> str:
        """Extract the first sentence as a title, truncated to platform limit."""
        first = re.split(r"(?<=[.!?])\s", script_text.strip())[0].strip()
        limit = _TITLE_CHAR_LIMITS[platform]
        if len(first) > limit:
            first = first[: limit - 3] + "..."
        return first

    def _make_hashtags(
        self,
        niche: str,
        custom: list[str],
        platform: Platform,
    ) -> list[str]:
        """
        Build a deduplicated, platform-limited hashtag list.

        Order: AI disclosure tag → niche defaults → custom tags.
        """
        limit = _HASHTAG_LIMITS[platform]
        base = ["#AIInfluencer", "#AIContent"]
        niche_tags = _NICHE_HASHTAGS.get(niche.lower(), [f"#{niche.replace(' ', '')}"])
        custom_normalised = [
            f"#{h.lstrip('#').replace(' ', '')}" for h in custom if h.strip()
        ]
        combined = base + niche_tags + custom_normalised
        # Deduplicate preserving order
        seen: set[str] = set()
        unique: list[str] = []
        for tag in combined:
            if tag.lower() not in seen:
                seen.add(tag.lower())
                unique.append(tag)
        return unique[:limit]

    def _make_description(
        self,
        script_text: str,
        hashtags: list[str],
        platform: Platform,
        is_paid_partnership: bool,
    ) -> str:
        """
        Compose a full description within the platform character limit.
        Always appends AI disclosure. Appends partnership notice if applicable.
        """
        limit = _DESC_CHAR_LIMITS[platform]
        disclosure = "\n\n[AI-Generated Content]"
        partnership = "\n#AD #Sponsored" if is_paid_partnership else ""
        tag_block = "\n\n" + " ".join(hashtags)

        suffix = disclosure + partnership + tag_block
        body_limit = limit - len(suffix)
        body = script_text[:body_limit].rstrip()

        return body + suffix
