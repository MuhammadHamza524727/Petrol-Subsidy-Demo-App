# 🎨 UI/UX Skill System – Petrol Subsidy Demo App

## 📌 Overview
This document defines the complete UI/UX system for the app.
Two themes are supported via a single toggle button:

| Theme   | Feel                              |
|---------|-----------------------------------|
| Light   | Clean government/fintech — white, blue tones |
| Neon    | Dark matte + emerald green glow   |

---

## 🎨 Neon Dark Theme — Color System

| Purpose          | Token              | Value                  |
|------------------|--------------------|------------------------|
| Background       | `--background`     | `#050505` matte black  |
| Surface / Card   | `--card`           | `#0D1117` midnight     |
| Primary Accent   | `--primary`        | `#10B981` emerald green|
| Glow Highlight   | `--accent`         | `#34D399` soft mint    |
| Heading Text     | `--foreground`     | `#FFFFFF`              |
| Secondary Text   | `--secondary-fg`   | `#94A3B8`              |
| Muted Labels     | `--muted-fg`       | `#475569`              |
| Border           | `--border`         | `rgba(16,185,129,0.15)`|

---

## ✨ Effects

### Neon Glow (primary buttons, active elements)
```css
box-shadow: 0 0 20px rgba(16, 185, 129, 0.35);
```

### Glassmorphism (overlays, modals)
```css
background: rgba(13, 17, 23, 0.8);
backdrop-filter: blur(12px);
border: 1px solid rgba(16, 185, 129, 0.15);
```

### Neon Border Pulse (hover state)
```css
border-color: rgba(16, 185, 129, 0.5);
box-shadow: 0 0 8px rgba(16, 185, 129, 0.2);
```

### Custom Scrollbar (neon)
```css
scrollbar-color: rgba(16, 185, 129, 0.3) #050505;
```

---

## 🖤 Light Theme — Color System

Uses shadcn default system: white background, blue-600 primary, slate grays.

---

## 🔘 Theme Toggle

- Button location: top-right of disclaimer banner (all pages) + dashboard nav
- Icons: ⚡ for neon mode, ☀️ for light mode
- Persisted in `localStorage('theme')`
- Anti-flash script in `<head>` to prevent white flash on neon reload

---

## 📐 Layout Rules

- Max content width: `max-w-4xl`
- Mobile breakpoint: 640px
- Nav height: 56px (dashboard), 48px (public)
- Card border radius: `rounded-xl`
- Button min-height: 44px (touch target)

---

## 🔤 Typography

- Font: Inter (Google Fonts)
- Hero headings: `text-3xl sm:text-4xl font-bold`
- Section titles: `text-xl font-semibold`
- Body: `text-sm` / `text-base`
- Mono (CNIC): `font-mono`

---

## 📱 Mobile-First Rules

- All buttons: `min-h-[44px]` (WCAG touch target)
- Inputs: `min-h-[44px]`
- Nav labels: hidden on mobile (`hidden sm:inline`)
- Cards: full-width on mobile, grid on sm+
- Font size: never below `text-xs` for critical info

---

## 🌐 Language System

- Two modes: `en` (English) | `ur` (Roman Urdu)
- Toggle: `اردو / EN` button in disclaimer banner
- Translation helper: `t(english, urdu)` from `useLang()`
- Persisted in `localStorage('lang')`
