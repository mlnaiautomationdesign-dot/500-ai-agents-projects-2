"""
Multi-Platform Exporter
------------------------
Exports platform-ready video files for TikTok, YouTube, Instagram, and Twitter.

Features:
  - 9:16 export for TikTok / Instagram Reels / YouTube Shorts
  - 16:9 export for YouTube / Twitter
  - Auto-generated filenames (persona + timestamp + platform tag)
  - Dry-run mode: previews without uploading
  - Platform API publishing (Twitter, Instagram Graph API)
  - TikTok and YouTube: file prep only (manual upload or SDK required)
"""

import os
import shutil
from abc import ABC, abstractmethod
from datetime import datetime
from pathlib import Path

from distribution.formatter import FormattedContent, Platform


def _auto_filename(persona_name: str, platform: str, ratio: str) -> str:
    """Generate an auto-named output filename."""
    ts = datetime.now().strftime("%Y%m%d_%H%M%S")
    ratio_tag = ratio.replace(":", "x")
    return f"{persona_name}_{platform}_{ratio_tag}_{ts}.mp4"


def _prepare_export_file(
    source_video: str,
    dest_dir: str,
    filename: str,
) -> str:
    """
    Copy the source video to the export directory with the auto-generated name.
    Never overwrites existing files — appends a counter if collision occurs.
    """
    dest = Path(dest_dir)
    dest.mkdir(parents=True, exist_ok=True)

    target = dest / filename
    counter = 1
    while target.exists():
        stem = Path(filename).stem
        target = dest / f"{stem}_v{counter}.mp4"
        counter += 1

    shutil.copy2(source_video, str(target))
    return str(target.resolve())


class BaseExporter(ABC):
    """Abstract base class for all platform exporters."""

    dry_run: bool = False

    @abstractmethod
    def publish(
        self,
        content: FormattedContent,
        rendered_videos: dict[str, str],
        persona_name: str,
    ) -> dict:
        """
        Publish or prepare content for the platform.

        Args:
            content:         Formatted caption/hashtags from ContentFormatter.
            rendered_videos: dict mapping aspect_ratio → video file path.
            persona_name:    Used for file naming.

        Returns:
            dict with keys: status, url (if available), exported_files.
        """


class TikTokExporter(BaseExporter):
    """
    Prepares a 9:16 video for TikTok.
    Auto-names the file. TikTok API upload requires TikTok for Developers
    access — file is saved locally for manual upload or SDK integration.
    """

    REQUIRED_RATIO = "9:16"

    def __init__(self, output_dir: str = "output/export/tiktok", dry_run: bool = False) -> None:
        self.output_dir = output_dir
        self.dry_run = dry_run

    def publish(
        self,
        content: FormattedContent,
        rendered_videos: dict[str, str],
        persona_name: str,
    ) -> dict:
        video_path = rendered_videos.get(self.REQUIRED_RATIO)
        if not video_path:
            return {"status": "error", "message": f"No {self.REQUIRED_RATIO} video available for TikTok."}

        filename = _auto_filename(persona_name, "tiktok", self.REQUIRED_RATIO)
        exported = _prepare_export_file(video_path, self.output_dir, filename)

        if self.dry_run:
            return {"status": "dry_run", "exported_file": exported, "caption": content.caption}

        # TikTok Content Posting API integration placeholder
        # See: https://developers.tiktok.com/doc/content-posting-api-get-started
        return {
            "status": "ready",
            "exported_file": exported,
            "note": "Upload exported_file to TikTok via their Content Posting API or manually.",
        }


class YouTubeExporter(BaseExporter):
    """
    Prepares a 16:9 video for YouTube (long-form) or 9:16 for YouTube Shorts.
    Auto-names the file. YouTube Data API v3 upload can be added here.
    """

    def __init__(
        self,
        output_dir: str = "output/export/youtube",
        shorts: bool = False,
        dry_run: bool = False,
    ) -> None:
        self.output_dir = output_dir
        self.shorts = shorts
        self.dry_run = dry_run
        self.required_ratio = "9:16" if shorts else "16:9"

    def publish(
        self,
        content: FormattedContent,
        rendered_videos: dict[str, str],
        persona_name: str,
    ) -> dict:
        video_path = rendered_videos.get(self.required_ratio)
        if not video_path:
            return {"status": "error", "message": f"No {self.required_ratio} video for YouTube."}

        platform_tag = "ytshorts" if self.shorts else "youtube"
        filename = _auto_filename(persona_name, platform_tag, self.required_ratio)
        exported = _prepare_export_file(video_path, self.output_dir, filename)

        if self.dry_run:
            return {"status": "dry_run", "exported_file": exported, "caption": content.caption}

        # YouTube Data API v3 upload placeholder
        return {
            "status": "ready",
            "exported_file": exported,
            "note": "Upload via YouTube Data API v3 or YouTube Studio.",
        }


class InstagramExporter(BaseExporter):
    """
    Publishes a 9:16 Reel or 1:1 feed video to Instagram via Graph API.
    """

    def __init__(
        self,
        output_dir: str = "output/export/instagram",
        dry_run: bool = False,
    ) -> None:
        self.output_dir = output_dir
        self.dry_run = dry_run

    def publish(
        self,
        content: FormattedContent,
        rendered_videos: dict[str, str],
        persona_name: str,
    ) -> dict:
        video_path = rendered_videos.get("9:16") or rendered_videos.get("1:1")
        if not video_path:
            return {"status": "error", "message": "No 9:16 or 1:1 video for Instagram."}

        ratio = "9:16" if "9:16" in rendered_videos else "1:1"
        filename = _auto_filename(persona_name, "instagram", ratio)
        exported = _prepare_export_file(video_path, self.output_dir, filename)

        if self.dry_run:
            return {"status": "dry_run", "exported_file": exported, "caption": content.caption}

        # Instagram Graph API — requires hosted media URL
        import requests
        ig_user_id = os.environ["INSTAGRAM_USER_ID"]
        access_token = os.environ["INSTAGRAM_ACCESS_TOKEN"]
        base = f"https://graph.facebook.com/v18.0/{ig_user_id}"

        media_resp = requests.post(
            f"{base}/media",
            params={
                "video_url": exported,  # must be publicly accessible URL in production
                "caption": content.caption,
                "media_type": "REELS",
                "access_token": access_token,
            },
            timeout=30,
        )
        media_resp.raise_for_status()
        container_id = media_resp.json()["id"]

        publish_resp = requests.post(
            f"{base}/media_publish",
            params={"creation_id": container_id, "access_token": access_token},
            timeout=30,
        )
        publish_resp.raise_for_status()
        return {"status": "ok", "exported_file": exported}


class TwitterExporter(BaseExporter):
    """Posts a 16:9 or 1:1 video to Twitter/X via the v2 API."""

    def __init__(
        self,
        output_dir: str = "output/export/twitter",
        dry_run: bool = False,
    ) -> None:
        self.output_dir = output_dir
        self.dry_run = dry_run

    def publish(
        self,
        content: FormattedContent,
        rendered_videos: dict[str, str],
        persona_name: str,
    ) -> dict:
        video_path = rendered_videos.get("16:9") or rendered_videos.get("1:1")
        if not video_path:
            return {"status": "error", "message": "No 16:9 or 1:1 video for Twitter."}

        ratio = "16:9" if "16:9" in rendered_videos else "1:1"
        filename = _auto_filename(persona_name, "twitter", ratio)
        exported = _prepare_export_file(video_path, self.output_dir, filename)

        if self.dry_run:
            return {"status": "dry_run", "exported_file": exported, "caption": content.caption}

        import tweepy
        client = tweepy.Client(
            bearer_token=os.environ["TWITTER_BEARER_TOKEN"],
            consumer_key=os.environ["TWITTER_API_KEY"],
            consumer_secret=os.environ["TWITTER_API_SECRET"],
            access_token=os.environ["TWITTER_ACCESS_TOKEN"],
            access_token_secret=os.environ["TWITTER_ACCESS_SECRET"],
        )
        # Twitter v1.1 media upload required for video; then attach media_id to tweet
        auth = tweepy.OAuth1UserHandler(
            os.environ["TWITTER_API_KEY"],
            os.environ["TWITTER_API_SECRET"],
            os.environ["TWITTER_ACCESS_TOKEN"],
            os.environ["TWITTER_ACCESS_SECRET"],
        )
        api_v1 = tweepy.API(auth)
        media = api_v1.media_upload(filename=exported, chunked=True)
        response = client.create_tweet(
            text=content.caption,
            media_ids=[media.media_id],
        )
        tweet_id = response.data["id"]
        return {
            "status": "ok",
            "exported_file": exported,
            "url": f"https://twitter.com/i/web/status/{tweet_id}",
        }


class ExporterFactory:
    """Returns the correct exporter for a platform."""

    _registry: dict[str, type[BaseExporter]] = {
        "tiktok": TikTokExporter,
        "youtube": YouTubeExporter,
        "instagram": InstagramExporter,
        "twitter": TwitterExporter,
    }

    @classmethod
    def get(cls, platform: str, dry_run: bool = False, **kwargs) -> BaseExporter:
        exporter_cls = cls._registry.get(platform.lower())
        if exporter_cls is None:
            raise ValueError(f"No exporter for platform: {platform}")
        return exporter_cls(dry_run=dry_run, **kwargs)
