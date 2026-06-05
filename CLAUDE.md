# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

**Sono Mágico Animadabra** — plataforma de rituais de sono infantil com foco em regulação emocional.

## Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run lint      # ESLint
```

## Stack

- **Next.js 14** (App Router)
- **TypeScript** (strict)
- **Tailwind CSS** + CSS custom properties
- **Supabase** (`@supabase/ssr`) — Auth + Database

## Environment

Copy `.env.local` and fill in:
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

## Project Structure

```
/app              — Next.js App Router pages
/components/ui    — Reusable primitive components (Button, Card, Input…)
/components/features — Domain-specific components (rituals, breathing, stories…)
/lib              — Supabase clients
/hooks            — Custom React hooks
/types            — Shared TypeScript interfaces
```

## Supabase Clients

- **`lib/supabase.ts`** — browser client (use in Client Components and hooks)
- **`lib/supabase-server.ts`** — server client (use in Server Components and Route Handlers)

Never import the server client in Client Components.

## Design System

All tokens are defined in `app/globals.css` and mapped to Tailwind in `tailwind.config.ts`.

**Theme:** Dark night-sky theme with glassmorphism cards and purple gradients.

**Colors:**
- Background: Deep Night `#1A0A3C` (`bg-background`)
- Surface: Royal Purple `#3D1A78` (`bg-surface`)
- Primary: Mystic Violet `#6B3FA0` (`bg-primary`)
- Cards: Glassmorphism `rgba(255,255,255,0.06)` — use `glass-card` utility class
- Accent Gold: `#F5B942` (`text-accent-gold`) — streaks, premium, achievements
- Accent Teal: `#4ECDC4` (`text-accent-teal`) — free badges, positive feedback
- Accent Orange: `#FF8C42` (`text-accent-orange`) — premium gradients, urgency
- Text: `#F0E8FF` (primary), `rgba(240,232,255,0.65)` (secondary), `rgba(240,232,255,0.38)` (muted)

**Typography:**
- `font-heading` → Fredoka One (headings, display)
- `font-body` → Nunito (body, buttons, labels)

**Border Radius:** `rounded-sharp` (4px), `rounded-sm` (8px), `rounded-md` (12px), `rounded-card` (16px), `rounded-lg` (20px), `rounded-pill` (50px)

**Shadows:** `shadow-card`, `shadow-elevated`, `shadow-glow`, `shadow-gold`, `shadow-magic` — all purple-tinted, never pure black.

**Buttons:** Pill-shaped (`rounded-pill`), gradient backgrounds, font-body font-extrabold. Variants: primary, secondary, ghost, premium.

**Badges:** Pill-shaped. Free = teal, Premium = gold, New = orange.

**Rules:**
- Never use hardcoded hex colors in components — always use Tailwind tokens
- Gradients are allowed inline for CTAs: `linear-gradient(135deg, #7B4FC0, #9B6DD4)`
- UI must be mobile-first
- Use `glass-card` for card backgrounds (includes backdrop-filter blur)
- Disabled state: `opacity-[0.38]`
- Press state: `active:scale-[0.96]`

## Implementation Order (MVP)

1. ✅ Setup base (Supabase client, globals.css, tailwind, layout)
2. Auth — `/login`, email login, session persistence
3. Onboarding — profile + child creation
4. UI components — Button, Card, Input, Badge, ProgressBar
5. Dashboard — streak, start ritual button
6. Ritual flow — steps + save progress
7. Breathing — CSS animation (inhale/exhale)
8. Stories — list + individual page
9. Emotional thermometer — selection + persistence

## Code Conventions

- File names: `kebab-case`
- Variables/functions: `camelCase`
- Components: `PascalCase`
- Keep functions small and focused
- No code duplication — extract reusable components to `/components/ui`
