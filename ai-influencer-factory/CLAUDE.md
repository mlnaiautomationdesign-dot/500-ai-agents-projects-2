# CLAUDE.md — AI Influencer Factory

## Overview

This document defines Claude Code's operational boundaries for the AI Influencer
Factory project. All rules are strict and non-negotiable unless explicitly
overridden by a project maintainer in writing.

---

## Safe Zones (Permitted to Edit)

The following paths are safe to read, modify, create, and refactor:

| Path                  | Permitted Operations                              |
|-----------------------|---------------------------------------------------|
| `/core/`              | Read, Write, Refactor, Delete modules             |
| `/avatar/`            | Read, Write, Refactor, Delete modules             |
| `/distribution/`      | Read, Write, Refactor, Delete modules             |
| `/configs/*.json`     | Read, Write (confirm before overwrite)            |
| `main.py`             | Read, Write, Refactor                             |
| `CLAUDE.md`           | Read only — never modify without explicit order   |

---

## Forbidden Zones (Never Touch)

| Path                  | Rule                                              |
|-----------------------|---------------------------------------------------|
| `/node_modules/`      | Never read, write, or delete                      |
| `/models/`            | Never modify weights; never retrain automatically |
| `/.git/`              | Never manipulate git internals directly           |
| `/output/`            | **Append-only — never auto-delete any file**      |
| `/output/exports/`    | Read-only after creation; no overwrites           |
| `.env`                | Never read values, log, or print secrets          |
| `requirements.txt`    | Propose changes only; never auto-modify           |
| `pyproject.toml`      | Propose changes only; never auto-modify           |

---

## Model Boundaries

- **Never retrain, fine-tune, or alter model weights** in `/models/` automatically.
- Never download model weights from unverified or unsigned sources.
- Never hard-code model paths — always resolve from config.
- Before running any model inference, confirm the model file exists and its
  checksum matches the manifest. Fail loudly if it does not.
- If a required model is absent, log a `ModelNotFoundError` and fall back to
  the registered fallback adapter. Never silently degrade output quality.
- Model selection is controlled by `RenderConfig` and persona config — not by
  application code heuristics.

---

## GPU Usage Limits

- Before any GPU workload, query available VRAM (`nvidia-smi --query-gpu=memory.free`).
- Do not schedule tasks that together exceed **80% of available VRAM**.
- All GPU-intensive rendering must run through the **Celery task queue** —
  never block the main thread or API event loop with GPU inference.
- RIFE 60fps interpolation is **opt-in only** (`RenderConfig.use_rife=True`).
  Never auto-enable it.
- If GPU is unavailable, fall back to CPU mode and log a `WARNING`. Never
  silently produce degraded output without informing the caller.
- Concurrent GPU task limit: **2 render jobs per GPU** unless overridden in config.

---

## Dependency Rules

- **Never modify files inside `/node_modules/` or site-packages directly.**
- All new Python dependencies must be pinned to exact or minor-range versions
  in `requirements.txt` or `pyproject.toml`.
- Run `pip-audit` before proposing any new dependency.
- Forbidden patterns in application code:
  - `eval()` with user-supplied input
  - `exec()` with user-supplied input
  - `pickle.loads()` on untrusted data
  - `subprocess.run(..., shell=True)` with unsanitized strings
  - `os.system()` with any variable content

---

## Output Folder Rules

- `/output/` is an **append-only zone**. No file inside it may be deleted
  automatically under any circumstance.
- Before overwriting any existing file in `/output/`, prompt the user and
  require explicit confirmation.
- Enforce the auto-naming convention for all exported artifacts:
  `{persona_name}_{platform}_{YYYYMMDD_HHMMSS}.mp4`
- Intermediate artifacts (`/output/face/`, `/output/body/`, `/output/rendered/`)
  may be cleaned only when the user issues an explicit cleanup command.
- Exports in `/output/exports/` are treated as immutable once written.

---

## Content Safety Rules

- **Never generate content** that impersonates a real, named human individual
  without documented written consent stored in the persona config.
- Every generated script **must pass the dual-pass safety filter** before
  advancing to the rendering pipeline. Bypassing it is forbidden.
- Hard-blocked content categories (zero exceptions):
  - Hate speech or content dehumanizing protected groups
  - CSAM or any sexualized content involving minors
  - Medical diagnosis or treatment presented as authoritative fact
  - Legal advice presented as professional counsel
  - Financial advice constituting regulated investment guidance
  - Electoral misinformation or political manipulation
  - Instructions for self-harm, violence, or illegal activity
- All AI-generated video output must include embedded AI disclosure metadata
  before upload. Stripping this metadata is forbidden.
- Safety filter rejections are logged to an immutable `safety_incidents` table.
  This table is append-only — application code must never delete from it.

---

## Persona Config Rules

- **Always confirm with the user before overwriting** any file in `/configs/`.
- Never auto-delete a persona configuration.
- Persona `id` fields are **immutable** once assigned — never rename or reassign.
- Never commit API keys, voice clone IDs, OAuth tokens, or credentials
  of any kind into persona JSON files or any file tracked by git.
- Three safety violations from the same `persona_id` within 24 hours must
  auto-suspend that persona and surface a warning to the user.

---

## Code Generation Rules for Claude Code

### You MAY:
- Add new modules in `/core/`, `/avatar/`, `/distribution/`
- Add new platform adapters following `BasePlatformAdapter`
- Extend `EmotionEnum` and animation parameter mappings
- Write and improve unit and integration tests
- Refactor module internals without changing public interfaces
- Improve prompt templates in `script_generator.py`

### You MUST NOT:
- Remove, weaken, or skip any check in the safety filter or persona validator
- Write to or modify anything in `/models/` or `/output/` outside the rules above
- Log, print, or expose values read from `.env` or `os.environ` secrets
- Add code that constructs shell commands using unescaped user input
- Auto-push to `main` or `master` branch — always use a feature branch
- Add undocumented admin endpoints, hidden flags, or backdoors of any kind
- Modify `SafetyConfig` dataclass fields in a way that removes required checks

---

## Incident Response Protocol

1. Any `HardBlockException` from the safety filter must be logged immediately
   with: timestamp, persona ID, content hash (SHA-256, not raw content), and
   rejection reason code.
2. Slack/webhook alert fires on every `HardBlockException`.
3. Three incidents from the same persona within 24 hours → persona status set
   to `SUSPENDED`; human review required to reinstate.
4. The `safety_incidents` log is append-only. No `DELETE` or `UPDATE` queries
   are permitted against it by application code.

---

## Regulatory Notes

- **EU AI Act (2025)**: This system likely qualifies as a high-risk AI content
  generation system. Maintain audit logs for a minimum of 3 years.
- **FTC Endorsement Guidelines**: Sponsored-content personas must include clear
  AI and paid-partnership disclosure in both video content and caption.
- **Platform AI labeling**: Each export adapter must apply current platform-
  required AI content labels before upload. These requirements change — review
  quarterly.
