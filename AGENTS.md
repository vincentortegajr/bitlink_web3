# AGENTS Log & Collaboration Guide

## Purpose
This file is the central coordination log for every AI agent and human contributing to this repository. It tracks who worked on what, when, and why. By keeping this log current, we avoid overlapping tasks and ensure smooth hand‑offs between contributors.

## How to Update This Log
1. **Add a new entry** whenever you:
   - Create a branch or start a new task
   - Make a commit
   - Open, update, or merge a PR
2. **Append** your entry to the end of the table below. Never edit or remove existing entries.
3. Keep your summary short but descriptive. Reference issue numbers or documentation when relevant.
4. Check `tasks.md` and `AGENT_HANDOFF_DOCUMENTATION.md` before starting work and after every commit to ensure alignment with project requirements.

## Entry Format
Use the table format shown below. Example:
```
| Date       | Agent      | Branch                     | Commit/PR | Summary                                |
|------------|-----------|----------------------------|-----------|----------------------------------------|
| 2025-01-23 | @agent1   | feature/mobile-nav-fix     | a1b2c3d   | Fixed mobile nav scroll issue.        |
```
- **Date**: `YYYY-MM-DD`
- **Agent**: Your name or handle
- **Branch**: Name of the branch you are working on
- **Commit/PR**: Short commit hash or PR number
- **Summary**: One sentence describing the change

## Branching Guidelines
- Create descriptive branches for each task (e.g., `feature/ai-studio-contrast`).
- Log the branch in this file before committing code.

## Avoiding Overlap
- Review the latest entries before starting new work.
- If you claim a task, add an entry with "(in progress)" in the summary.
- Mark it "(complete)" once the PR is merged.

## Automation Suggestions
- **Git Commit Template**: Configure `.gitmessage` and a `commit-msg` hook to automatically append new entries here based on commit info.
- **CI Check**: Use GitHub Actions to ensure a new entry exists for each PR.

## Log
| Date | Agent | Branch | Commit/PR | Summary |
|------|-------|--------|-----------|---------|
| 2025-07-25 | codex | work | c25f340 | Initial AGENTS log added |
| 2025-07-25 | codex | work | bff2954 | Add vite.config.mjs |
| 2025-07-25 | codex | work | 17f998b | Install deps, verified build |

## Broadcast: Build Verified - July 25, 2025
All agents must run `npm install` and verify `npm run dev` and `npm run build` succeed on their environment. Linting currently fails due to missing `react-app` config. Review `tasks.md` under **PHASE 6: LINT CONFIGURATION REPAIR** and update accordingly before further feature work.
