# 🚀 GigOS v1 – God‑Tier Gig Worker OS

GigOS is a **command center for gig workers**, built initially around Atlanta routes and Survey Merchandiser, but designed to grow into a full OS for all your gig domains: field audits, remote surveys, AI data tasks, game testing, and more.

---

## ✨ High‑Level Overview

GigOS v1 gives you:

- A **Command Center** home page with earnings, effective hourly rate, and time worked.
- A **Domain Directory** of gig categories (Remote Surveys, AI Tasks, Field & Local, etc.) and key providers.
- A **Field & Local Gigs board** that unifies field jobs (starting with Survey Merchandiser) with filters, distance, and $/hr utility.
- A **Tasks view** of everything you’ve imported across providers.
- An **Import flow** (form + API) that lets you pull jobs from Survey.com into GigOS.
- A **Tools page** with a bookmarklet design for one‑click capture.

This version is focused on **data model, intake pipeline, and UI framing** so later we can layer on earnings tracking, routing, and automation.

---

## 🧱 Tech Stack

- **Framework:** Next.js 15 (App Router, TypeScript)
- **Styling:** Tailwind CSS
- **ORM:** Prisma 5.22
- **Database:** PostgreSQL (Neon hosted)
- **Package Manager:** pnpm
- **Environment:** GitHub Codespaces, Turbo monorepo
- **Language:** TypeScript (frontend + backend)

---

## 🗂 App Structure (Monorepo)

Relevant parts of the repo:

```txt
/
├─ apps/
│  ├─ gigos/                # Main Next.js app
│  │  ├─ app/
│  │  │  ├─ page.tsx        # Command Center
│  │  │  ├─ domains/        # Work Domains directory
│  │  │  ├─ field-local/    # Field & Local pages
│  │  │  │  ├─ page.tsx     # Field & Local gig board
│  │  │  │  └─ import/page.tsx   # Import UI
│  │  │  ├─ tasks/          # All tasks
│  │  │  ├─ tools/          # Tools + bookmarklet
│  │  │  ├─ api/
│  │  │  │  └─ tasks/
│  │  │  │     └─ import/survey-merch/route.ts   # Import API
│  │  ├─ components/
│  │  │  ├─ TaskCard.tsx    # Gig card UI
│  │  │  └─ ImportForm.tsx  # Simple import form
│  │  ├─ lib/prisma.ts      # Prisma client helper
│  │  ├─ prisma/schema.prisma  # DB schema
│  │  ├─ tailwind.config.ts
│  │  └─ tsconfig.json
│  └─ gigos-ext/            # (Future) Chrome extension for auto-sync
├─ scripts/
│  └─ seed.ts or seed.cjs   # DB seeding (domains + providers)
└─ README.md
