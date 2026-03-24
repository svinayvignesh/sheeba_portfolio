# Sheeba Sukumaran Portfolio — Deep Analysis & Implementation Plan

## The Core Problem (Revised)

The reference sites (Lando Norris, Mont-Fort) are NOT minimal — they're full of dramatic motion. Mountains move, images scale, text reveals sweep across the screen. But every animation follows ONE system: one easing curve, one timing, one visual language. Your site has lots of motion too, but it's 5 different kinds of motion fighting each other (stock video playback, mouse parallax, pinned scroll, entrance fades, floating shapes). The result feels chaotic instead of cinematic.

The fix is not "remove animation." It's **replace scattered effects with a unified motion system.**

---

## DIAGNOSIS: What's Broken and Why

### 1. Wrong Kind of Video Usage

**Current state:** 5 stock videos used as section wallpaper, heavily overlaid to be barely visible.

**The real problem:**
- The videos are decorative wallpaper, not narrative. They don't *do* anything — they just sit there behind dark overlays
- Stock "holographic dashboard" and "neural network" clips look AI-generated and generic
- Play/pause on scroll causes visible stuttering (the "abrupt stop" issue)
- Heavy overlays (0.6-0.95 opacity) make the video barely visible anyway — so why have it?
- 35MB of assets for visual elements that are 80% obscured

**What Lando Norris does differently:**
- ONE hero video, in a masked container, playing naturally — not as background wallpaper
- The video is the *content*, not decoration behind content
- Other sections use scroll-driven image animations instead of video

### 2. Missing the "Moving Mountains" Techniques

**What your site lacks that the reference sites have:**

- **Parallax image layers** — Images at different scroll speeds creating depth (this is the "mountains moving" feeling)
- **Scroll-driven scale transforms** — Images that grow from 80% to 100% as you scroll into them
- **Clip-path reveals** — Text and images that "wipe" into view using animated clip-path masks
- **Split-text animations** — Headlines where each line or word animates in separately with staggered delays
- **Sticky sections with content that scrolls over** — A background image stays pinned while content cards scroll past it
- **Horizontal marquee tickers** — Continuous scrolling text strips that add motion between sections
- **Elliptical image masking** — Images revealed through organic shapes rather than rectangles

Instead, your site relies on: basic `opacity: 0 → 1, y: 60 → 0` fades for everything. That's the most basic entrance animation and it gets repetitive across 7 sections.

### 3. Scroll Architecture Problems

**Current state:** Two pinned sections (Hero + Timeline) with `scrub` mode fighting Lenis smooth scroll.

**Why it's janky:**
- Hero is pinned with `scrub: 1` — user scrolls but only an overlay opacity changes, feels broken
- Timeline horizontal scroll recalculates on every frame, fights with Lenis
- Video play/pause creates additional stutter
- No variety in scroll interaction — some sections should pin, others should flow

**What the reference sites do:**
- Lando Norris uses `position: sticky` (CSS-native) for pinned elements — much smoother than GSAP pin
- Scrub animations are used for *transforming visible elements* (scale, translate, clip-path), not for opacity-only changes
- Pinned sections are strategic — maybe 1-2 per page, not everywhere

### 4. Color & Theme

**Current state:** Dark navy + cyan + gold + glassmorphism everywhere.

**The problem:** Two accent colors (cyan AND gold) creates a gaming dashboard aesthetic. Glass blur on every card = visual monotony.

**Reference sites use:** ONE strong accent color on a clean dark or light base. Lando Norris: lime on dark green. Mont-Fort: clean corporate neutrals.

### 5. FloatingElements = Wrong Kind of Motion

Random geometric shapes floating on mousemove is decorative noise. The reference sites create motion through **content movement** — images, text, and sections that move purposefully in response to scrolling, not mouse wiggling.

---

## THE PLAN: Cinematic Motion Rebuild

### Phase 1: Build the Motion System First

Before touching any section, establish the unified animation language that will govern everything.

#### 1A. Global animation constants

```css
:root {
  /* ONE easing curve for everything (Lando Norris uses this) */
  --ease-cinematic: cubic-bezier(0.65, 0.05, 0, 1);
  --duration-default: 0.75s;
  --duration-slow: 1.2s;
  --duration-fast: 0.4s;
}
```

Every animation on the site uses this ONE easing. This is the single biggest thing that makes Lando Norris feel cohesive.

#### 1B. Create reusable scroll animation primitives

Build these as utility components/hooks that any section can use:

1. **`<RevealText>`** — Split-text animation component
   - Splits heading text into lines (or words)
   - Each line has `clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%)` initially
   - On scroll enter, clip-path animates to reveal (or translateY from below the clip)
   - Stagger: 0.1s between lines
   - This replaces your current `gsap.from({ opacity: 0, y: 60 })` on headings

2. **`<ParallaxImage>`** — Scroll-speed image component
   - Image inside an overflow-hidden container
   - Image has `scale(1.2)` and translates on scroll at a different rate than the page
   - Creates the "mountains moving" depth illusion
   - Uses GSAP ScrollTrigger with `scrub: true` (this IS a good use of scrub)

3. **`<ScaleReveal>`** — Scale-on-scroll container
   - Element starts at `scale(0.85)` and `border-radius: 20px`
   - Scrubs to `scale(1)` and `border-radius: 0` as you scroll into it
   - Great for full-width image/video sections

4. **`<ClipReveal>`** — Clip-path wipe-in
   - Element hidden with `clip-path: inset(0 100% 0 0)` (or similar)
   - Animates to `clip-path: inset(0 0 0 0)` on scroll
   - For images, cards, and dividers

5. **`<Marquee>`** — Horizontal ticker
   - Continuous CSS animation: `translateX(0) → translateX(-50%)`
   - Content duplicated for seamless loop
   - Pauses on hover
   - Use between sections as visual breathing room

6. **`<StickyMedia>`** — Pinned background with scrolling content
   - Uses CSS `position: sticky` (not GSAP pin)
   - Media (image or video) stays pinned while text content scrolls over it
   - Much more performant than GSAP pin + scrub

### Phase 2: Rebuild Each Section with Cinematic Motion

#### 2A. Hero — The "Wow" Moment

**Current:** Video wallpaper + centered text + bounce arrow.
**New design:**

```
┌─────────────────────────────────────────┐
│  [Nav bar - transparent, appears on     │
│   scroll with backdrop blur]            │
│                                         │
│                                         │
│   SHEEBA          ← RevealText, line 1  │
│   SUKUMARAN       ← RevealText, line 2  │
│                   (massive: 12-16vw)    │
│                                         │
│   Director of Business Transformation   │
│   Data & Technology                     │
│                                         │
│   [Scroll indicator]                    │
│                                         │
│   ┌─────────────────────────────┐       │
│   │  Background: either         │       │
│   │  - ONE quality video loop   │       │
│   │  - OR large parallax image  │       │
│   │  - OR bold gradient/color   │       │
│   └─────────────────────────────┘       │
└─────────────────────────────────────────┘
```

**Motion recipe:**
- Name text: `<RevealText>` with clip-path, stagger 0.12s per line, delay 0.3s
- Subtitle: fade up with 0.6s delay
- Background: if video, use `<ScaleReveal>` — starts slightly scaled, opens up
- On scroll DOWN past hero: content fades + translates up (parallax out), background image has slower scroll speed (depth)
- Use `position: sticky` for the hero background so it stays while content scrolls away

**If keeping video:** ONE video only. Remove saturate/brightness filters. Use a subtle dark gradient overlay (not radial — linear from bottom). Consider: slow aerial city footage, abstract flowing shapes, or high-quality architectural motion. Must be under 4MB, WebM + MP4.

#### 2B. Impact — Numbers That Hit Hard

**Current:** Video bg + glass cards + counter animation.
**New design:**

```
┌─────────────────────────────────────────┐
│                                         │
│  IMPACT BY THE NUMBERS  ← RevealText   │
│                                         │
│   53%          67%                      │
│   Faster       Faster Quarterly         │
│   Cycle Time   Close                    │
│                                         │
│   40%          50%                      │
│   Better       Fewer AML               │
│   Response     Findings                 │
│                                         │
│   ← Numbers animate with counter        │
│   ← Each number is a ClipReveal         │
│   ← Stagger: 0.15s between cards       │
│                                         │
└─────────────────────────────────────────┘
```

**Motion recipe:**
- No video background. Clean solid dark bg OR alternate to light bg for contrast
- Numbers: HUGE typography (8-10vw), counter animation (keep this — it works)
- Each metric group: `<ClipReveal>` from left, staggered
- Heading: `<RevealText>`
- The numbers themselves ARE the visual — no cards needed

#### 2C. Career Journey — Sticky Media + Scroll Content

**Current:** Horizontal pinned scroll (the jankiest part).
**New design — Option A: Sticky image + scrolling cards:**

```
┌──────────────────┬──────────────────────┐
│                  │                      │
│  [Sticky image   │  2003-2012           │
│   or abstract    │  Foundations in       │
│   visual that    │  Tech & Product      │
│   stays pinned]  │  ────────────────    │
│                  │  Towers Watson ·      │
│  ← ParallaxImage │  Family Health       │
│  ← Changes or   │                      │
│    progresses    │  2012-2016           │
│    as you scroll │  Scaling Enterprise  │
│                  │  Systems             │
│                  │  ────────────────    │
│                  │  ... (scrolls past)  │
│                  │                      │
└──────────────────┴──────────────────────┘
```

**Option B: Full-width stacked cards with parallax:**
- Each role is a full-width section
- Background image/color shifts between roles
- Text enters with `<RevealText>`, images with `<ParallaxImage>`
- Progress indicator on the side (vertical line that fills)

**Motion recipe:**
- Left column: `position: sticky; top: 20vh` — stays while right column scrolls
- Right column cards: each enters with `<ClipReveal>` from bottom
- Progress line: scales with scroll progress (scaleY, transform-origin: top)
- NO horizontal scroll. NO GSAP pin. Pure CSS sticky + ScrollTrigger entrance animations.

#### 2D. Stories — Scale Reveal Cards

**Current:** Video bg + 3 dense inline case studies.
**New design:**

```
┌─────────────────────────────────────────┐
│                                         │
│  ─── MARQUEE TICKER ──────────────────  │
│  "Digital Transformation · AI · M&A ·"  │
│                                         │
│  TRANSFORMATION     ← RevealText        │
│  STORIES                                │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  01                              │   │
│  │  From 3 Weeks to 14 Days        │   │  ← ScaleReveal
│  │  53% faster · $12.3K saved      │   │    (scales from 0.9 to 1)
│  │  [Read More →]                  │   │
│  └──────────────────────────────────┘   │
│                                         │
│  ┌──────────────────────────────────┐   │
│  │  02                              │   │
│  │  30 Days to 10                   │   │  ← ScaleReveal
│  │  67% faster quarterly close      │   │    with 0.15s stagger
│  │  [Read More →]                  │   │
│  └──────────────────────────────────┘   │
│                                         │
└─────────────────────────────────────────┘
```

**Motion recipe:**
- Each story card: `<ScaleReveal>` — starts `scale(0.92)` with slight border-radius, grows to full width
- Story number (01, 02, 03): large watermark that parallaxes at different speed
- Between heading and cards: `<Marquee>` ticker with keywords
- Cards are summary only — expand on click for full case study, or link to subpage

#### 2E. Skills — Horizontal Marquee Rows

**Current:** Video bg + 2×2 glass card grid with tags.
**New design:**

```
┌─────────────────────────────────────────┐
│                                         │
│  EXPERTISE        ← RevealText          │
│                                         │
│  ←←← Digital Transformation · M&A ·    │  ← Marquee row 1 (scrolls left)
│      Innovation · Change Management ←←← │
│                                         │
│  →→→ AI/ML · Salesforce · HubSpot ·    │  ← Marquee row 2 (scrolls right)
│      SaaS · CRM · KPI Dashboards →→→   │
│                                         │
│  ←←← Agile · Lean Six Sigma ·          │  ← Marquee row 3 (scrolls left)
│      Scrum · Portfolio Mgmt ←←←        │
│                                         │
│  →→→ AML · KYC · Risk Assessment ·     │  ← Marquee row 4 (scrolls right)
│      Controls · Compliance →→→          │
│                                         │
└─────────────────────────────────────────┘
```

**Motion recipe:**
- Each row is a `<Marquee>` component — CSS infinite translateX animation
- Alternating directions (left, right, left, right) for visual rhythm
- Each row at slightly different speed (25s, 30s, 22s, 28s)
- Rows fade in with stagger on scroll enter
- This creates constant, mesmerizing motion with zero jank — pure CSS animation
- No video, no cards, no glass. The motion IS the design.

#### 2F. Education + Contact — Combined Footer

**Current:** Two separate sections with the same glass card treatment.
**New design:**

```
┌─────────────────────────────────────────┐
│                                         │
│  ─── MARQUEE ────────────────────────   │
│  "Let's transform together ·"           │
│                                         │
│  LET'S              ← RevealText        │
│  CONNECT            (massive type)      │
│                                         │
│  M.Sc Computer Science                  │
│  B.Sc Computer Science                  │
│  SAFe · PMP · CSPO · Lean Six Sigma    │
│                                         │
│  [Email] [LinkedIn] [Resume ↓]          │
│                                         │
│  ────────────────────────────────────   │
│  © 2026 Sheeba Sukumaran                │
│                                         │
└─────────────────────────────────────────┘
```

### Phase 3: Color & Typography (The Vibe)

#### 3A. New palette — Dark & Cinematic

```css
:root {
  --color-bg: #0C0C0C;           /* near-black, not navy */
  --color-bg-alt: #141414;       /* subtle section alternation */
  --color-bg-card: #1A1A1A;      /* cards if needed */
  --color-text: #FFFFFF;
  --color-text-dim: #888888;
  --color-accent: #C9A84C;       /* gold — ONE accent only */
  --color-accent-soft: rgba(201, 168, 76, 0.15);
  --color-border: rgba(255, 255, 255, 0.08);
}
```

Key change: **drop cyan entirely.** One accent color (gold) makes it feel intentional and premium. The near-black background (#0C0C0C) is darker and more cinematic than the current navy (#0A1628).

#### 3B. Typography — Bold & Commanding

```css
:root {
  /* Display font for headings — use a serif or strong display sans */
  --font-display: 'DM Serif Display', serif;    /* Option A: serif authority */
  /* OR */
  --font-display: 'Outfit', sans-serif;          /* Option B: keep Outfit but use it BIGGER */

  --font-body: 'Inter', sans-serif;              /* Keep Inter for body */
}

/* Hero name: MASSIVE */
.hero-name {
  font-size: clamp(4rem, 14vw, 12rem);
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.04em;
  text-transform: uppercase;
}

/* Section headings: large and confident */
.section-heading {
  font-size: clamp(2.5rem, 6vw, 5rem);
  font-weight: 700;
  line-height: 1.0;
  letter-spacing: -0.03em;
}
```

The hero name should FILL the viewport width. That's what makes Lando Norris's site feel impactful — the type IS the design.

### Phase 4: Navigation

#### 4A. Sticky nav with scroll-aware theme

```
┌─ SHEEBA SUKUMARAN ── Impact · Journey · Stories · Skills ── Resume ↓ ─┐
```

- Starts transparent over the hero
- After scrolling past hero: gains `backdrop-filter: blur(12px)` and subtle bg
- Active section highlighted with gold accent
- Uses IntersectionObserver (not ScrollTrigger) for section detection
- Smooth scroll to anchor on click (Lenis `scrollTo`)

### Phase 5: Remove the Old System

#### 5A. Delete these files/components
- `ScrollVideo.js` — replaced by `<ParallaxImage>` and `<StickyMedia>`
- `FloatingElements.js` + `.module.css` — replaced by Marquee motion
- All 5 video files from `/public/videos/`
- Remove mouse parallax from every component

#### 5B. Keep and enhance
- Lenis smooth scroll (it's good — keep it)
- GSAP + ScrollTrigger (keep, but use differently — scrub for transforms, not opacity)
- Counter animation in Impact (it works)
- CSS Modules architecture (keep)
- CSS custom properties system (keep, update values)

---

## Cinematic Motion Cheat Sheet

| Technique | Where to use | GSAP config |
|-----------|-------------|-------------|
| **RevealText** (clip-path + translateY per line) | Every section heading, hero name | `scrub: false`, `once: true`, stagger 0.1s |
| **ParallaxImage** (different scroll speed) | Hero bg, Timeline sticky image, Story cards | `scrub: true`, translate Y based on scroll |
| **ScaleReveal** (scale 0.85→1 on scroll) | Story cards, full-width media sections | `scrub: true`, start "top 80%", end "top 20%" |
| **ClipReveal** (clip-path wipe) | Metric numbers, images, dividers | `scrub: true` or `once: true` depending on context |
| **Marquee** (CSS infinite translate) | Skills section, between-section dividers | Pure CSS, no GSAP needed |
| **Sticky + scroll content** | Timeline section (replace horizontal scroll) | CSS `position: sticky`, no GSAP pin |
| **Counter** (number increment) | Impact metrics | `once: true`, gsap.to with onUpdate |
| **Nav backdrop** | Navigation bar | IntersectionObserver, CSS transition |

---

## Implementation Order

| Step | Task | Effort | What it replaces |
|------|------|--------|-----------------|
| 1 | Build motion primitives (RevealText, ParallaxImage, ScaleReveal, ClipReveal, Marquee) | 4 hrs | All current scattered animations |
| 2 | New color palette + typography in globals.css | 1 hr | Current navy/cyan/gold/glass system |
| 3 | Rebuild Hero with RevealText + optional single video | 2 hrs | Current video wallpaper hero |
| 4 | Add sticky navigation bar | 2 hrs | No nav currently exists |
| 5 | Rebuild Impact with big type + ClipReveal counters | 1.5 hrs | Current glass cards on video |
| 6 | Rebuild Timeline as sticky-media layout | 3 hrs | Current janky horizontal scroll |
| 7 | Rebuild Stories with ScaleReveal cards | 2 hrs | Current dense inline case studies |
| 8 | Rebuild Skills as Marquee rows | 1.5 hrs | Current glass card grid on video |
| 9 | Combined Education + Contact footer | 1 hr | Two separate basic sections |
| 10 | Delete old components, videos, FloatingElements | 0.5 hr | 35MB of dead weight |
| 11 | Responsive testing + performance audit | 2 hrs | — |

**Total estimated effort: ~20 hours**

---

## The North Star (Revised)

The goal is NOT to strip the site bare. It's to replace **scattered, generic motion** (stock videos, glass blur, floating shapes, mouse wiggle) with **purposeful cinematic motion** (text reveals, parallax depth, scale transforms, marquee rhythm).

The reference sites feel alive because every element has an intentional entrance and scroll relationship. Your site has motion too, but it's the wrong kind — passive (videos playing) rather than active (elements transforming in response to the user's scroll).

**The shift: from "things moving in the background" to "the content itself is what moves."**
