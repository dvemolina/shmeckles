# Workflow (Claude Code + project state)

This repo is set up so **Claude Code** (implementation) and **normal Claude** (planning/review/debugging) can always understand the project by reading a few files.

## Source of truth files
- `PROJECT_SPEC.md` — current phase status, acceptance criteria, commands, changelog, blockers
- `DECISIONS.md` — locked decisions (stack, data rules, transfer model)
- `CLAUDE.md` — operating rules for Claude Code (phase checklist + reporting)

**Important:** Do not rely on chat history for project state. Always update `PROJECT_SPEC.md` after each phase.

---

## How to use Claude Code (recommended)

### Start a new Claude Code session
Paste something like:

> Read `WORKFLOW.md`, `PROJECT_SPEC.md`, `DECISIONS.md`, `CLAUDE.md` strictly.  
> Do ONLY **Phase X**.  
> Update `PROJECT_SPEC.md` to `IN PROGRESS` before coding, and `DONE` after, including notes + file list + commands.  
> Do not proceed to the next phase until I say so.

### After Claude finishes a phase
1. Review changes locally
2. Run the commands Claude listed
3. Commit + push (so the repo contains the latest status + context)

---

## How to use normal Claude
If normal Claude can access the repo, ask:

- “Read `PROJECT_SPEC.md`, `DECISIONS.md`, `CLAUDE.md` and summarize current status + next steps.”
- “Review Phase X implementation and point out risks/bugs.”

If normal Claude cannot access the repo, paste those files (or the `Current status` section + latest phase notes) into the chat.

---

## Development commands (keep updated in PROJECT_SPEC.md too)

### Web (SvelteKit)
- Install: `pnpm i`
- Dev: `pnpm dev`
- Build: `pnpm build`

### Native (Capacitor)
- Sync: `npx cap sync`
- Open iOS: `npx cap open ios`
- Open Android: `npx cap open android`

---

## Data rules (do not change)
- UUID string IDs everywhere
- Money stored as integer minor units: `amount_minor` (no floats)
- All tables include: `created_at`, `updated_at`, `deleted_at` (epoch ms)
- Transfers: `type='transfer'` with `account_id` (from) and `to_account_id` (to)
- UI never calls SQL directly — use repos/services
