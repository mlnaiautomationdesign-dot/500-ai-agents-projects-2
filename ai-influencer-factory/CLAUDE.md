# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Information

**Project Name:** ai-influencer-factory
**Description:** An automated AI influencer content creation and social media management platform that generates personas, creates content, and schedules posts across multiple platforms.
**Tech Stack:** Python
**Last Updated:** 2026-02-19

---

## Safe to Edit Zones

Claude Code MAY freely read, modify, and create files within these directories:

```
/core/             ✅ persona_engine.py, emotion_controller.py, script_generator.py
/avatar/           ✅ voice.py, face.py, body.py, renderer.py
/distribution/     ✅ formatter.py, exporter.py
/configs/          ✅ personas.json and any config files
/tests/            ✅ all test files
/docs/             ✅ all documentation files
main.py            ✅ application entry point
requirements.txt   ✅ dependency list
```

---

## Never Touch Zones

Claude Code MUST NOT modify, delete, or overwrite files in these locations:

```
/node_modules/     ❌ FORBIDDEN — managed by package manager only
/.git/             ❌ FORBIDDEN — git internals, never touch
/models/           ❌ FORBIDDEN — pre-trained model weights and checkpoints
/output/           ❌ FORBIDDEN — generated content; NEVER auto-delete any file here
.env               ❌ FORBIDDEN — credentials file; never read or write
```

**Additional forbidden actions:**
- Do NOT run `rm -rf` or any deletion command on `/output/` or its contents
- Do NOT commit any file matching `*.env`, `.env*`, or containing API keys
- Do NOT modify `pyproject.toml` lock sections without explicit user instruction

---

## Model Boundaries

```
ALLOWED:
- Call OpenAI API (GPT-4, DALL-E 3, TTS-1) via environment variable keys
- Call Anthropic API (Claude) via environment variable keys
- Use gTTS for offline TTS

FORBIDDEN:
- Never retrain, fine-tune, or modify model weights automatically
- Never download or store model weights to /models/ without user confirmation
- Never switch the active LLM model without explicit user instruction
- Never call any model API using hardcoded credentials
- Never log or print API responses containing user data to stdout in production
```

---

## GPU Usage Limits

```
- Do NOT schedule GPU-intensive tasks without user confirmation
- Video rendering (moviepy) should default to CPU unless GPU is explicitly enabled
- Never saturate the GPU queue with concurrent render jobs
- Max concurrent render jobs: 1 (sequential by default)
- If GPU OOM error occurs: fail gracefully, log error, do NOT retry automatically
```

---

## Dependency Rules

```
/node_modules/     → NEVER MODIFY. Run `npm install` only if package.json changes.
Python packages    → Add to requirements.txt; never pip install globally in scripts
                     without user approval.
New dependencies   → Must be added to requirements.txt explicitly.
                     Never use `pip install <pkg>` in application code at runtime.
```

---

## Output Folder Protection

```
/output/           → READ ONLY for Claude Code. Never delete. Never overwrite without
                     explicit user confirmation. New renders append; they do not replace.

Rules:
- Before writing to /output/, check if file exists. If it does, append a timestamp suffix.
- Never call shutil.rmtree, os.remove, or Path.unlink on /output/ contents.
- The /output/ directory must always exist. Create it if missing, never delete it.
```

---

## Persona Config Safety

```
configs/personas.json:
- ALWAYS confirm with user before overwriting persona configs
- Treat personas.json as user data — never auto-modify during code generation
- New personas may be appended; existing entries must not be removed automatically
```

---

## Content Safety Boundaries

```
- NEVER generate content impersonating real, identifiable people without consent
- NEVER generate health/medical claims or financial advice without disclaimers
- NEVER generate content targeting minors in exploitative or inappropriate contexts
- All AI-generated content must be disclosable as AI-generated
- Dry-run mode (DRY_RUN=true) must be used by default; live posting requires explicit opt-in
- All content passes moderation check before export
- Maximum post frequency: 5 posts/day per persona per platform
```

---

## Development Commands

```bash
# Setup
pip install -r requirements.txt
cp .env.example .env      # then fill in API keys

# Run
python main.py            # full pipeline (dry_run by default)
DRY_RUN=false python main.py   # live posting

# Quality
python -m pytest          # run tests
python -m flake8 src/     # lint
python -m black src/      # format
```

---

## Environment Variables (required)

All credentials loaded from `.env` only — never hardcoded:

```
OPENAI_API_KEY
ANTHROPIC_API_KEY
TWITTER_API_KEY / TWITTER_API_SECRET / TWITTER_ACCESS_TOKEN / TWITTER_ACCESS_SECRET / TWITTER_BEARER_TOKEN
INSTAGRAM_USER_ID / INSTAGRAM_ACCESS_TOKEN
ELEVENLABS_API_KEY      (optional)
DATABASE_URL            (optional, defaults to sqlite)
DRY_RUN                 (true by default)
```
