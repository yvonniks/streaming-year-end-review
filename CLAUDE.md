# Netflix Year-End Review — Claude Code & Figma MCP Rules

This is a mobile prototype (375×812 iPhone frame) built as a single React file with no routing library, no external UI kit, and no backend.

---

# MCP Servers

## Figma MCP server rules

These rules activate automatically whenever you use Figma MCP tools (`get_design_context`, `get_image`, etc.).

### Mandatory workflow — always follow this order

1. Call `get_design_context` on the target frame/component **before writing any code**.
2. Call `get_image` for a visual screenshot on any screen with images, glows, or layered elements.
3. Map every Figma element to an existing shared component before writing new JSX.
4. After implementing, call `get_image` again and compare — fix drift before finishing.

### Figma layer naming → React component mapping

| Figma layer name | React component |
|-----------------|-----------------|
| `StatusBar` | `<StatusBar>` |
| `NavBar` / `Navigation` | `<NavBar>` |
| `ProgressBar` / `StoryProgress` | `<ProgressBar activeIndex={n}>` |
| `HomeBar` / `HomeIndicator` | `<HomeBar>` |
| `Glow` / `GlowBlob` | `<Glow top left color size>` |
| `GradText` / `GradientText` | `<GradText gradient="...">` |
| `NetflixN` / `Logo` | `<NetflixN>` |
| `XIcon` / `CloseIcon` | `<XIcon>` |
| `Screen0`–`Screen6` | Corresponding `<ScreenN>` function |

If a Figma layer has no matching component, implement it inline inside the relevant `ScreenN` function — do **not** create new files or top-level components unless it will be used on 3+ screens.

### Token sync rules (bidirectional)

- **Figma → Code:** If a design token in Figma differs from the values below, flag the discrepancy and ask which is canonical before writing code.
- **Code → Figma:** If a token changes in code, update the Figma style/variable and the table in this file in the same edit session.

### Auto Layout ↔ absolute positioning

This prototype uses **fixed absolute positioning** (not flexbox layout) to match pixel-perfect mobile specs from Figma. Follow these rules:

- All elements inside a screen use `position: absolute` with explicit `top`, `left`, `right`, or `bottom` pixel values matching the Figma frame.
- The phone frame is always `width: 375, height: 812`.
- Do not use Tailwind layout classes (`flex`, `grid`, `p-`, `m-`) for screen positioning — use inline `style={}` pixel values.
- Tailwind utility classes are only acceptable for things like `className="absolute inset-0 pointer-events-none flex items-center justify-center"` where they don't affect the main layout offsets.

### What to do when designs add new screens

1. Add a new `function ScreenN() { ... }` in `src/App.js`.
2. Add it to the `SCREENS` array.
3. Update `ProgressBar`'s `segmentForScreen` map if the new screen belongs to a new progress segment.
4. Add the Figma layer name → component mapping to the table above.

---

## Design Tokens (exact values — never approximate)

### Brand colors
```
Netflix Red:       #E50914
Deep Red (shadow): #7C020D
Dark maroon:       rgba(229,9,20,0.2)  ← glow tint
```

### Background
```
Phone frame bg:    #000
Outer chrome bg:   #111
```

### Common gradients
| Use | Value |
|-----|-------|
| Year number fill | `linear-gradient(to bottom, rgba(200,146,149,1), rgba(229,9,20,0.8) 50%, rgba(77,23,84,1))` |
| Year ghost blur | `linear-gradient(to bottom, rgba(200,146,149,0.2), rgba(229,9,20,0.16), rgba(77,23,84,0.2))` |
| Dark vignette overlay | `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(14,8,39,0.6))` |
| Hero card (red) | `linear-gradient(135deg, #EA2A33, #c0101a)` |
| Merge/CTA button | `linear-gradient(90deg, #E50914, #21073E)` |
| Heading text | `linear-gradient(to bottom, #fff, #a0a0a0)` |
| Blue glow blob | `linear-gradient(135deg, #2563EB, #143885)` |

### Glassmorphism surfaces (dark theme)
| Use | CSS |
|-----|-----|
| Feature cards | `background: rgba(255,255,255,0.05); borderRadius: 16; backdropFilter: blur(10px)` |
| Data rows | `background: rgba(255,255,255,0.08); borderRadius: 14; backdropFilter: blur(8px)` |
| NavBar border | `borderBottom: 1px solid rgba(128,128,128,0.2)` |
| Progress segment (inactive) | `background: rgba(255,255,255,0.3)` |
| Progress segment (active) | `background: #fff` |

### Glow blobs
Rendered with the `<Glow>` component — `filter: blur(56px)`, `borderRadius: 9999`.
Common tints:
- Netflix red: `rgba(229,9,20,0.15)` to `rgba(229,9,20,0.3)`
- Blue accent: `rgba(37,99,235,0.1)`
- Dark maroon fill: `rgba(50,35,36,0.4)`

### Typography
- Font: `'Inter', sans-serif` (set on the phone frame wrapper)
- Heading large: `fontSize: 30–32, fontWeight: 800`
- Sub-heading: `fontSize: 22–28, fontWeight: 700–800`
- Body: `fontSize: 14–15, fontWeight: 400–500`
- Labels/meta: `fontSize: 12–13, fontWeight: 500–700`
- Caps label (NavBar): `fontSize: 10, fontWeight: 700, letterSpacing: 3, textTransform: uppercase`
- Do NOT use Tailwind text-size classes for typography inside screens — use inline `fontSize` px values to match Figma specs exactly.

### Text colors
| Role | Value |
|------|-------|
| Primary | `#fff` |
| Secondary | `rgba(255,255,255,0.6–0.8)` |
| Muted | `#A3A3A3` or `#9CA3AF` |
| Accent red | `#E50914` |
| Muted label | `#D1D5DB` |

---

## Border Radius Conventions

| Element | Value |
|---------|-------|
| Phone frame | `borderRadius: 44` |
| Cards, modals | `borderRadius: 14–16` |
| Genre pills / buttons | `borderRadius: 16` |
| CTA button (pill) | `borderRadius: 9999` |
| Glow blobs | `borderRadius: 9999` |
| Progress segments | `borderRadius: 2` |

---

## Component Conventions

All UI lives in `src/App.js`. No separate component files.

### Shared components (already defined — do not recreate)
| Name | Props | Purpose |
|------|-------|---------|
| `NetflixN` | — | SVG Netflix "N" logo (17×30) |
| `XIcon` | — | SVG close icon (14×14) |
| `StatusBar` | — | Black status bar with time + icons |
| `NavBar` | — | Black nav with logo + title + close |
| `ProgressBar` | `activeIndex` | 5-segment story progress bar |
| `HomeBar` | — | iOS home indicator pill |
| `Glow` | `top left right bottom color size` | Blurred radial glow blob |
| `GradText` | `gradient children style` | Gradient-clipped text span |

### Screen structure
```
SCREENS = [Screen0, Screen1, Screen2, Screen3, Screen4, Screen5, Screen6]
```
Each `ScreenN` renders its content as absolutely positioned children inside the 375×812 frame. The frame handles: `StatusBar`, `NavBar`, `ProgressBar`, `HomeBar` — do not render these inside a screen function.

---

## Assets

- Local images (`sparkling-star.png`, `stranger-things.jpg`, `poster.jpg`, `hoodie.jpg`) are in `src/` — import and use directly.
- Do not introduce new npm packages for icons — use inline SVG.
- Emoji are acceptable for small decorative icons only.

---

## What Never to Hardcode

- Do not use Tailwind color classes (`text-red-500`, `bg-black`) for brand colors — use inline `style={}` with the exact hex/rgba values from the token table.
- Do not use Tailwind spacing/sizing for screen-level layout — use absolute pixel positioning.
- Do not hardcode the phone frame dimensions anywhere other than the `App` wrapper (`width: 375, height: 812`).

---

## Code → Figma Guidance

When updating Figma to match coded changes:
- Phone frame is always 375×812 in Figma, `borderRadius: 44` → corner radius 44.
- Glow blobs: use a circle with 7–30% opacity fill + Gaussian blur 56px in Figma.
- Glassmorphism rows: Fill color white at 5–8% opacity + blur 8–10px.
- Always use Auto Layout in Figma for repeating rows (feature cards, genre pills, data rows).
- Gradient text: apply the gradient as a fill on the text layer with `Clip to text` enabled.
