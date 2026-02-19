"""
Content Formatter
-----------------
Formats generated content (script, caption, media) to meet
each platform's specific constraints: character limits, aspect ratios,
hashtag rules, and text structure.
"""

from dataclasses import dataclass
from enum import Enum


class Platform(str, Enum):
    TWITTER = "twitter"
    INSTAGRAM = "instagram"
    TIKTOK = "tiktok"
    YOUTUBE = "youtube"


# Platform-specific constraints
PLATFORM_CONSTRAINTS: dict[Platform, dict] = {
    Platform.TWITTER: {
        "max_caption_chars": 280,
        "max_hashtags": 3,
        "video_aspect_ratios": ["16:9", "1:1"],
        "max_video_duration_s": 140,
    },
    Platform.INSTAGRAM: {
        "max_caption_chars": 2200,
        "max_hashtags": 30,
        "video_aspect_ratios": ["9:16", "1:1", "4:5"],
        "max_video_duration_s": 90,
    },
    Platform.TIKTOK: {
        "max_caption_chars": 2200,
        "max_hashtags": 10,
        "video_aspect_ratios": ["9:16"],
        "max_video_duration_s": 600,
    },
    Platform.YOUTUBE: {
        "max_caption_chars": 5000,
        "max_hashtags": 15,
        "video_aspect_ratios": ["16:9"],
        "max_video_duration_s": None,  # No limit for long-form
    },
}


@dataclass
class FormattedContent:
    platform: Platform
    caption: str
    hashtags: list[str]
    video_path: str | None = None
    image_path: str | None = None
    is_within_limits: bool = True
    warnings: list[str] = None

    def __post_init__(self):
        if self.warnings is None:
            self.warnings = []


class ContentFormatter:
    """
    Validates and formats content for a specific platform.
    Truncates captions, trims hashtags, and reports constraint violations.
    """

    def format(
        self,
        platform: Platform,
        caption: str,
        hashtags: list[str],
        video_path: str | None = None,
        image_path: str | None = None,
    ) -> FormattedContent:
        constraints = PLATFORM_CONSTRAINTS[platform]
        warnings = []

        # Trim hashtags
        max_tags = constraints["max_hashtags"]
        if len(hashtags) > max_tags:
            warnings.append(
                f"Trimmed hashtags from {len(hashtags)} to {max_tags} for {platform}."
            )
            hashtags = hashtags[:max_tags]

        # Build caption body
        tag_str = " ".join(f"#{t.lstrip('#')}" for t in hashtags)
        full_caption = f"{caption}\n\n{tag_str}".strip()
        max_chars = constraints["max_caption_chars"]

        if len(full_caption) > max_chars:
            # Truncate caption body to fit, keep hashtags
            available = max_chars - len(tag_str) - 2  # 2 for newlines
            caption = caption[:available].rstrip() + "…"
            full_caption = f"{caption}\n\n{tag_str}".strip()
            warnings.append(f"Caption truncated to fit {platform} limit ({max_chars} chars).")

        return FormattedContent(
            platform=platform,
            caption=full_caption,
            hashtags=hashtags,
            video_path=video_path,
            image_path=image_path,
            is_within_limits=len(warnings) == 0,
            warnings=warnings,
        )
