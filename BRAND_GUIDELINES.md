# Superproxy — Brand Guidelines

> Extracted from the live codebase of Superproxy CRM v3 UI.

---

## 1. Brand Identity

| Attribute | Value |
|-----------|-------|
| **Product Name** | Superproxy |
| **Type** | AI-powered Sales CRM (B2B SaaS) |
| **Personality** | Professional, clean, modern, AI-first |
| **Tone** | Enterprise-grade yet approachable — minimalist with delightful micro-interactions |
| **Mode** | Light mode only (no dark mode) |

### Logo Assets (`/public/`)

| File | Format | Usage |
|------|--------|-------|
| `superproxy-logo.png` | PNG | Primary — sidebar header, widget header |
| `superproxy_logo.svg` | SVG | Vector version for scalable contexts |
| `superproxy_logo_(2).jpg` | JPG | Alternate |

- **Logo height**: 28px (`h-7`), width auto, `object-contain`
- **Brand hierarchy**: "Superproxy" is the unified brand identity. "AI Proxy" is a sub-feature, not a separate brand.

---

## 2. Color System

### 2.1 Primary Neutrals — Slate Palette

The entire UI is built on the **slate** neutral family. This is the backbone of the visual identity.

| Token | Hex | Role |
|-------|-----|------|
| `slate-900` | `#0f172a` | Headings, primary text |
| `slate-800` | `#1e293b` | Dark text, tooltip backgrounds |
| `slate-700` | `#334155` | Secondary text |
| `slate-600` | `#475569` | Body text (default) |
| `slate-500` | `#64748b` | Tertiary text |
| `slate-400` | `#94a3b8` | Placeholder, disabled text, default icons |
| `slate-300` | `#cbd5e1` | Borders, scrollbar thumb |
| `slate-200` | `#e2e8f0` | Light borders, dividers |
| `slate-100` | `#f1f5f9` | Light backgrounds |
| `slate-50` | `#f8fafc` | Very light backgrounds |

### 2.2 Brand Accent

**Amber-500 `#F59E0B`** — The one accent color for the entire product. Used for:
- Upgrade CTAs and pricing highlights
- Active step indicators (quote/invoice creation flows)
- Feature gate prompts and inline upgrade hints
- Toggles (on state) in recording modal
- Selection borders (walkthrough modal, voice cards)
- Sidebar "Upgrade" link

**Rules:**
1. Amber = upgrade/unlock/active indicator. Nothing else.
2. Slate-900 = primary action buttons (Continue, Publish, Send). Not upsell.
3. No blue/indigo/purple for interactive brand elements.

### 2.3 Semantic Colors (Don't repurpose)

| Purpose | Color Family | Usage |
|---------|-------------|-------|
| **Success / Delivered** | emerald | Success states, invoice doc type, delivered activity |
| **Error / Danger** | rose / red | Delete actions, recording indicator, unread badge |
| **Admin role** | blue | Admin badge, quote doc type, "Sales Qualified Lead" |
| **Informational** | purple | Voice info note, AI-specific context |
| **Gamification** | orange | Leaderboard ranks, expiring notifications, hot streak |
| **Status: Draft** | amber | Draft status badge |
| **Status: Sent** | sky | Sent status badge |
| **Status: Published** | indigo | Published status badge |
| **Status: Expired** | slate | Expired status badge |
| **Status: Deal Won** | emerald | Won status badge |
| **Status: Deal Lost** | rose | Lost status badge |

### 2.3 Background Palette

| Surface | Value |
|---------|-------|
| Page background | `#fafafa` or `white` |
| Card | `bg-white` or `bg-white/50` (frosted) |
| Glass card | `rgba(255,255,255,0.65)` + `backdrop-blur(10px)` |
| Glass nav | `rgba(255,255,255,0.7)` + `backdrop-blur(10px)` |
| Header bar | `bg-white/60 backdrop-blur-xl` |
| Overlay | `bg-slate-900/20 backdrop-blur-sm` |

### 2.4 Category Colors (AI Proxy Feature)

| Category | Color |
|----------|-------|
| Contacts | Blue |
| Companies | Violet |
| Products | Amber |
| Quotes | Indigo |
| Invoices | Emerald |

### 2.5 Template Theme Palette (User-Facing)

These colors are available for users when customizing quote/invoice templates:

```
Ocean Blue    #3b82f6    Deep Navy     #1e40af    Midnight      #1e293b
Forest Green  #059669    Emerald       #10b981    Energy Orange #ea580c
Amber         #f59e0b    Crimson       #dc2626    Rose          #e11d48
Violet        #7c3aed    Teal          #0d9488    Cyan          #06b6d4
Slate         #475569    Charcoal      #374151    Bronze        #92400e
```

---

## 3. Typography

### 3.1 Font Stack

| Role | Family | Source |
|------|--------|--------|
| **Primary** | `Poppins` | Google Fonts — weights 300, 400, 500, 600, 700 |
| **Display** | `DM Serif Text` | Google Fonts — serif accent |
| **Monospace** | System monospace | Data fields, codes |

### 3.2 Type Scale

| Role | Size | Weight | Tracking | Usage |
|------|------|--------|----------|-------|
| Hero | `text-[2.6rem]` (41.6px) | Bold (700) | `tracking-tight` | Pricing hero text |
| Card title | `text-2xl` (24px) | Semibold (600) | `tracking-tight` | Stat cards |
| Page title | `text-lg` (18px) | Semibold (600) | `tracking-tight` | Page headers |
| Body | `text-sm` (14px) | Normal (400) | — | Default text |
| Body alt | `text-[13px]` | Medium (500) | — | Table cells |
| Small / caption | `text-xs` (12px) | Normal (400) | — | Descriptions |
| Section label | `text-[11px]` | Bold (700) uppercase | `tracking-wider` | Category labels |
| Micro | `text-[10px]` | Semibold (600) | `tracking-widest` | Tiny badges |

### 3.3 Line Heights

| Context | Value |
|---------|-------|
| Headings | `leading-tight` (1.25) or `leading-none` (1) |
| Body text | Default / `leading-relaxed` (1.625) |

---

## 4. Spacing & Layout

### 4.1 Sidebar

| Property | Value |
|----------|-------|
| Expanded width | `w-72` (288px) |
| Collapsed width | `w-[88px]` (88px) |
| Corner radius | `rounded-[24px]` |
| Margin | `my-3 mr-3` |
| Shadow | `0 8px 40px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)` |
| Collapse transition | 300ms |

### 4.2 Content Area

| Element | Spacing |
|---------|---------|
| Header | `px-8 py-4`, sticky top-0 |
| Page content | `p-6` or `p-8` |

### 4.3 Common Spacing Tokens

| Token | Pixels | Usage |
|-------|--------|-------|
| `p-5` | 20px | Card padding |
| `p-6` | 24px | Section padding |
| `p-8` | 32px | Page-level padding |
| `px-4 py-2` | 16×8 | Standard button |
| `px-3 py-1.5` | 12×6 | Small button / toggle |
| `gap-2` | 8px | Tight spacing |
| `gap-3` | 12px | Standard spacing |
| `gap-3.5` | 14px | Nav item spacing |
| `gap-4` | 16px | Section spacing |

---

## 5. Border Radius

| Token | Size | Usage |
|-------|------|-------|
| `rounded-md` | 6px | Toggle items, small elements |
| `rounded-lg` | 8px | Toggle groups |
| `rounded-xl` | 12px | Buttons, inputs, small cards, icon buttons |
| `rounded-2xl` | 16px | Cards, drawers, dropdowns |
| `rounded-[24px]` | 24px | Sidebar container |
| `rounded-full` | 9999px | Pills, avatars, circular buttons |

---

## 6. Elevation / Shadows

| Level | Box-Shadow | Usage |
|-------|-----------|-------|
| **Subtle** | `0 2px 8px rgba(0,0,0,0.04), 0 8px 24px rgba(0,0,0,0.03)` | Cards, stat blocks |
| **Medium** | `0 4px 12px -2px rgba(0,0,0,0.15)` | Hover states |
| **Dropdown** | `0 8px 32px rgba(0,0,0,0.12), 0 2px 8px rgba(0,0,0,0.06)` | Floating menus |
| **Modal** | `0 24px 80px rgba(0,0,0,0.12), 0 0 0 1px rgba(0,0,0,0.03)` | Drawers, modals |
| **Sidebar** | `0 8px 40px rgba(0,0,0,0.06), 0 2px 8px rgba(0,0,0,0.03)` | Navigation panel |
| **Tooltip** | `shadow-2xl` + `ring-1 ring-white/10` | Dark sidebar tooltips |

### Colored Shadows (Hover / Focus)

```
Amber:   shadow-amber-500/15, shadow-amber-500/25 (upgrade CTAs)
Emerald: shadow-emerald-500/20
Rose:    shadow-rose-500/30
Slate:   shadow-slate-900/30 (primary action buttons)
```

---

## 7. Component Patterns

### 7.1 Buttons

**Standard Button**
```
border border-slate-200 text-slate-600
hover:bg-slate-50 hover:border-slate-300 hover:text-slate-800
px-4 py-2 rounded-xl transition-all active:scale-[0.98]
```

**Icon Button**
```
w-9 h-9 rounded-xl border border-slate-200
text-slate-400 hover:text-slate-600 hover:bg-slate-50
flex items-center justify-center
```

**Sidebar Nav Item**
```
rounded-2xl px-4 py-3 gap-3.5 font-medium text-sm transition-all duration-300
Active:  bg-slate-900/[0.06]
Hover:   bg-slate-100/50
```

**Toggle / Tab**
```
px-3 py-1.5 rounded-md text-[12px] font-medium
Active:   bg-white text-slate-700 shadow-sm
Inactive: text-slate-400 hover:text-slate-600
```

### 7.2 Cards

**Standard Card**
```
bg-white rounded-2xl
shadow-[0_2px_8px_rgba(0,0,0,0.04),0_8px_24px_rgba(0,0,0,0.03)]
border border-slate-100/80 p-5
```

**Glass Card**
```
bg-white/50 rounded-2xl p-5
border border-white/60 shadow-sm ring-1 ring-slate-100/50
```

**Pricing Card**
```
bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden
```

### 7.3 Inputs

**Text Input**
```
rounded-xl border-slate-200 bg-white/80 px-3 py-2 text-sm text-slate-700
placeholder:text-slate-400
focus:outline-none focus:border-slate-400
```

**Search Input**
```
pl-10 pr-3 py-2.5 border border-slate-200 rounded-xl
text-slate-600 placeholder:text-slate-400
hover:border-slate-300 focus:outline-none focus:border-slate-400
```

> **Note**: No colored focus rings anywhere. Use `focus:outline-none focus:border-slate-400` — just a subtle border darkening on focus. Applied consistently across all inputs and textareas.

### 7.4 Status Badges

Pattern: `bg-{color}-50 text-{color}-600 border border-{color}-200/80 rounded-full px-2.5 py-0.5 text-xs font-medium`

| Status | Color Family |
|--------|-------------|
| Draft | Amber |
| Sent | Sky |
| Published | Indigo |
| Expired | Slate |
| Deal Won | Emerald |
| Deal Lost | Rose |

### 7.5 Dropdowns

**Container**
```
bg-white rounded-2xl
shadow-[0_8px_32px_rgba(0,0,0,0.12),0_2px_8px_rgba(0,0,0,0.06)]
border border-slate-100 z-50
```

**Menu Item**
```
px-3 py-2 rounded-xl text-sm
text-slate-500 hover:text-slate-900 hover:bg-slate-100/50
```

### 7.6 Drawers / Modals

**Overlay**: `bg-slate-900/20 backdrop-blur-sm`

**Drawer Header**
```
px-8 py-6 border-b border-slate-100/50
bg-white/40 backdrop-blur-md sticky top-0 z-10
```

**Entrance Animation**: `cubic-bezier(0.16, 1, 0.3, 1)` slide-in

---

## 8. Iconography

| Property | Value |
|----------|-------|
| **Library** | `@iconify/react` v6 |
| **Icon Set** | Solar (linear style) |
| **Small** | 10–15px (compact UI) |
| **Standard** | 18–20px (buttons, nav) |
| **Large** | 24px+ (page headers) |
| **Default color** | Inherit parent or `text-slate-400` |
| **Active emphasis** | `[&_*]:stroke-[2]` |

---

## 9. Animation & Motion

### 9.1 Timing

| Context | Duration |
|---------|----------|
| Micro-interactions (buttons, toggles) | 75ms |
| UI transitions (fades, slides) | 100ms |
| Layout transitions (sidebar, drawer) | 300ms |
| Celebrations (confetti, paper plane) | 600ms–1800ms |

### 9.2 Easing Curves

| Name | Value | Usage |
|------|-------|-------|
| Standard | `cubic-bezier(0.4, 0, 0.2, 1)` | General transitions |
| Elastic bounce | `cubic-bezier(0.34, 1.56, 0.64, 1)` | Playful elements |
| Modal entrance | `cubic-bezier(0.32, 0.72, 0, 1)` | Drawer/modal open |
| Smooth decel | `cubic-bezier(0.16, 1, 0.3, 1)` | Slide-in panels |

### 9.3 Interaction Patterns

| Pattern | Implementation |
|---------|---------------|
| Button press | `active:scale-[0.98]` |
| Hover lift | `hover:-translate-y-0.5` or `hover:-translate-y-1` |
| Glass card hover | `-2px translateY` + enhanced shadow |
| Entrance | `slideDownFade`, `fadeInUp` (staggered) |

### 9.4 Celebration Animations

Used on deal wins and successful actions:
- Confetti fall
- Money fall
- Paper plane fly
- Sparkle float
- Treasure burst
- Shimmer burst
- Success ripple
- Icon celebrate / shine

---

## 10. Glass Morphism

| Surface | Background | Blur | Border |
|---------|-----------|------|--------|
| Glass card | `rgba(255,255,255,0.65)` | `blur(10px)` | `rgba(255,255,255,0.6)` |
| Glass nav | `rgba(255,255,255,0.7)` | `blur(10px)` | — |
| Header bar | `bg-white/60` | `backdrop-blur-xl` | — |
| Text selection | `#bae6fd` bg | — | — |

---

## 11. Dark Accents

These dark elements create contrast anchors in the light interface:

**Sidebar Tooltip (collapsed state)**
```
bg-gradient-to-r from-slate-800 to-slate-900
text-white rounded-xl shadow-2xl ring-1 ring-white/10
```

**Floating AI Widget Pill**
- Dark background with gradient shadows
- Shimmer sweep animation
- Blue accent borders
- Two states: "New Task" / "Task in progress" (with animated progress bar)

---

## 12. Localization & Currency

| Property | Value |
|----------|-------|
| Primary currency | Thai Baht (฿ / THB) |
| Multi-currency | Supported in pricing tiers |
| Number formatting | Locale-aware |

---

## 13. Tech Stack Reference

| Layer | Technology |
|-------|-----------|
| Framework | React 18 + TypeScript |
| Styling | Tailwind CSS 3.4 (no custom theme extensions) |
| Icons | @iconify/react (Solar set) |
| Charts | Recharts + Chart.js |
| Backend | Supabase |
| Build | Vite 5 |
| UI Library | None — all custom components |

---

*Generated from the Superproxy CRM v3 UI codebase — March 2026*
