<!--
SYNC IMPACT REPORT
==================
Version change: (none) → 1.0.0
Modified principles: N/A (initial ratification)
Added sections:
  - Core Principles (6 principles)
  - Tech Stack & Architecture
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ aligned (Constitution Check gates apply)
  - .specify/templates/spec-template.md ✅ aligned (user story + acceptance criteria structure compatible)
  - .specify/templates/tasks-template.md ✅ aligned (phase/parallel task model compatible)
  - .specify/templates/phr-template.prompt.md ✅ aligned (PHR routing matches CLAUDE.md)
Follow-up TODOs:
  - RATIFICATION_DATE set to 2026-04-05 (today; no prior version exists)
  - Real NeonDB connection string must be stored in .env (never committed)
  - Grok API key must be stored in .env (never committed)
-->

# Petrol Subsidy Demo App (AI-Powered) Constitution

## Core Principles

### I. Disclaimer-First (NON-NEGOTIABLE)

Every page and every AI response MUST display a visible disclaimer stating this is NOT
a real government application and uses simulated/mock data. The disclaimer MUST appear:
- In the hero section of the Landing Page
- In the footer of every authenticated page
- Inline with every AI eligibility result or chatbot response

**Rationale**: This is a portfolio/demo project. Presenting it as a real government
service — even accidentally — is a legal and ethical risk. Disclaimers protect users
and the developer.

### II. Mobile-First, Accessibility-First UX

All UI MUST be designed mobile-first (320px baseline). Components MUST use:
- Large tap targets (minimum 44×44px)
- Simple, plain-language copy (grade 6 reading level or below)
- High-contrast colours meeting WCAG AA
- shadcn/ui primitives (do NOT build custom low-level components)
- Tailwind CSS utility classes only (no inline styles, no custom CSS unless unavoidable)

AI chatbot responses MUST mix simple English with Roman Urdu where natural
(e.g., "Aap eligible hain kyun ke aapki income low hai").

**Rationale**: The simulated target audience includes low-literacy, low-tech users
on mobile devices. UX complexity is the primary failure mode for this demographic.

### III. Mock-First Data (No Real PII)

The application MUST use mock/simulated data for all user-facing flows:
- CNIC eligibility MUST be rule-based simulation, not a real government database lookup
- Fuel quota and transactions MUST be seeded/generated — not real pump data
- No real CNIC numbers, names, or personal data MUST ever be stored or transmitted

**Rationale**: This is a demo. Connecting to real government systems is out of scope,
legally risky, and unnecessary for demonstrating the concept.

### IV. AI Explainability (Simple Language)

Every AI-generated output (eligibility prediction, chatbot response) MUST:
- Be written in simple, jargon-free language
- Include a plain-language explanation of the reasoning
- Avoid technical model outputs (logits, probabilities, raw JSON) in the UI
- Mix English + Roman Urdu naturally where it improves clarity

The Grok API MUST be called with a system prompt enforcing this tone. Responses
MUST be validated for length and language before rendering.

**Rationale**: The app's differentiator is making a complex government system
understandable to ordinary citizens. Opaque AI output defeats the purpose.

### V. Modular, Typed Full-Stack Architecture

The codebase MUST follow this structure:
- **Frontend**: Next.js 14+ App Router, TypeScript, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes / Server Actions (primary); FastAPI only for AI
  services that cannot run in the Next.js runtime
- **Database**: NeonDB (PostgreSQL via `@neondatabase/serverless` or Drizzle ORM)
- **AI**: Grok API for LLM; Web Speech API or a TTS service for voice output
- **QR**: `react-qr-code` for generation; mock scan simulation in-browser
- **Charts**: Recharts (no alternative charting library)

Each feature MUST live in its own route segment and server action file. Shared logic
MUST be extracted to `lib/` utilities. No business logic in React components.

**Rationale**: Modularity enables the 14-step incremental build plan and makes the
codebase legible to recruiters reviewing the portfolio.

### VI. Secrets & Environment Security

All API keys, database URLs, and tokens MUST be stored in `.env.local` (never
committed). The repository MUST contain a `.env.example` with placeholder values.
Next.js `NEXT_PUBLIC_` prefix MUST only be used for values safe to expose to the
browser. Grok API calls MUST be made server-side only.

**Rationale**: Portfolio projects are often public repos. A leaked API key or database
credential creates real financial and security risk even in a demo context.

## Tech Stack & Architecture

### Strict Stack (no substitutions without a new constitution amendment)

| Layer | Technology |
|---|---|
| Frontend framework | Next.js 14+ (App Router) |
| Styling | Tailwind CSS + shadcn/ui |
| Language | TypeScript (strict mode) |
| Database | NeonDB (PostgreSQL) |
| ORM / Query | Drizzle ORM or `@neondatabase/serverless` |
| AI / LLM | Grok API (xAI) |
| Voice / TTS | Web Speech API (`speechSynthesis`) or ElevenLabs |
| QR Code | `react-qr-code` |
| Charts | Recharts |
| Deployment | Vercel (frontend + API routes) |
| AI microservice | FastAPI on HuggingFace Spaces (if needed) |

### Database Schema (authoritative)

```sql
-- Users
id, cnic, name, phone, vehicle_type, eligibility_status, created_at

-- Transactions
id, user_id, liters_used, date, station_mock, remaining_after

-- Quota
user_id, total_quota, remaining_quota, reset_date
```

### Build Order (enforced)

Steps 1–14 as specified in the project brief MUST be followed in order.
No step may be skipped; each step is a git-committable increment.

## Development Workflow

- Every feature MUST start with a spec (`/sp.specify`) before implementation.
- Every implementation plan MUST pass the Constitution Check gates above.
- Commits MUST be small, focused, and reference the step number (e.g., `feat: step-02 landing page`).
- No secrets, tokens, or real PII MUST appear in any commit.
- All AI API calls MUST be server-side (API routes or Server Actions).
- The disclaimer (Principle I) MUST be verified present in every UI PR.
- PHR MUST be created after every significant user prompt per CLAUDE.md rules.

## Governance

This constitution supersedes all other project practices. Amendments require:
1. A clear rationale documenting what changed and why.
2. A version bump following semantic versioning:
   - **MAJOR**: Removal or redefinition of a principle, or stack replacement.
   - **MINOR**: New principle or section added.
   - **PATCH**: Wording clarification, typo fix, non-semantic refinement.
3. Updates to any affected templates or dependent docs.
4. A new PHR recording the amendment.

All PRs MUST verify compliance with Principles I–VI before merge.
Complexity violations MUST be documented in the `plan.md` Complexity Tracking table.

**Version**: 1.0.0 | **Ratified**: 2026-04-05 | **Last Amended**: 2026-04-05
