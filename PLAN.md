# Atlas POS · Ordering screen — build plan

Clickable code prototype of the ordering screen (Figma `3ewVFDwH7XM3HN3qY0NkX5`, node `257:21144`), built as a case study for an application to Atlas Kitchen. Atlas Kitchen builds its frontend applications in **React with Ant Design + Tailwind CSS**, so the prototype uses the same stack: AntD for standard controls, custom components for the parts no library covers, Tailwind for all styling. Like their frontends, it builds to static files (a single-page app) and is served from Cloudflare. There is no backend: all data comes from `menu.json`.

Source files (in `~/Downloads`): `BRIEF.md` and `tokens_1.css` are current. `BRIEF_1.md` and `tokens.css` are older versions; ignore them.

---

## 1. Stack

| Concern | Choice |
|---|---|
| Framework | **Vite + React + TypeScript** (single-page app, static build) |
| Standard controls | **Ant Design** (latest major), wrapped in `components/ui/` |
| Custom components | React + Tailwind |
| Styling | **Tailwind CSS v4** via `@tailwindcss/vite`, using the `@theme` token mapping in `tokens.css` |
| AntD theme | `ConfigProvider` with `theme.darkAlgorithm` + `antd-theme.ts` |
| AntD + Tailwind | CSS cascade layers: `@layer theme, base, antd, components, utilities`, with AntD's `StyleProvider layer` so Tailwind's reset doesn't break AntD and utilities can override AntD |
| Routing | None. One screen; `?device=` and `?order=` read and written with `URLSearchParams` + `history.replaceState` |
| Class helpers | `clsx` + `tailwind-merge` (`cn()`), and `tailwind-variants` for components with variants (Button, tiles) |
| Motion | `motion` (`motion/react`) for selection indicators that slide (active tab, view-toggle and device-switcher thumbs, via `layoutId`) and the device-frame resize. Pressed states are CSS (`:active`), no scale anywhere; flat controls get a pressed pill that grows in (`pressPill` in `lib/cn.ts`). **Motion tokens** live in `tokens.css` (primitives `--duration-*`, `--ease-out-quint` → semantic `--motion-press-in/out`, `--motion-select`, `--motion-frame`, `--motion-ease`); `lib/motion.ts` mirrors them for JS and `lib/motion.test.ts` fails if they drift. `MotionConfig reducedMotion="user"` + `motion-reduce:` respect the OS setting. |
| Icons | `iconoir-react` (regular) and `iconoir-react/solid` (filled) |
| Font | Inter via `@fontsource-variable/inter` (self-hosted, bundled) |
| State | One React context + reducer |
| Deploy | **Cloudflare Workers static assets** with `wrangler` (how Atlas serves its frontends). Firebase Hosting works the same way if preferred. |

### Changes from BRIEF.md

| Brief says | Plan does | Why |
|---|---|---|
| Next.js (App Router) | Vite + React SPA | Next.js isn't in their stack; the prototype has no server work; avoids AntD SSR setup and first-load flash |
| Base UI for primitives | Ant Design, wrapped | Matches Atlas Kitchen's stack; shows the design works in their codebase |
| `bg-overlay-pressed` (no token exists) | Add `--bg-overlay-pressed` (black 14%) + `--color-overlay-pressed` | Used by every raised pressed state |
| Page background uses `--neutral-950` (a primitive) | Add semantic `--bg-presentation` | Keeps the "semantic tokens only" rule |
| Empty order can't be reached | `?order=empty` URL flag | Lets reviewers see the Disabled actions |
| Tiles and buttons scale to 0.97 when pressed (§4, §6) | Nothing scales: raised pressed = `shadow-pressed` + overlay only, via CSS `:active` | Design decision |

### Findings from setup (phase 0)

| Finding | Effect on the plan |
|---|---|
| Vite now scaffolds with **Oxlint**, not ESLint | The `antd` import rule lives in `.oxlintrc.json` (`no-restricted-imports`, off for `components/ui/`, `theme/`, `App.tsx`). Verified: a stray import fails lint. |
| `antd` pins `@ant-design/cssinjs ~2.1.2`; a newer top-level copy breaks `StyleProvider` (two React contexts) | `@ant-design/cssinjs` pinned to `~2.1.2` so there is one copy |
| Iconoir's solid set has **no** filled map, view-grid, fire-flame or printer (only pause) | Export those 4 filled icons from Figma as SVG components in phase 2 (`components/ui/icons/`) |
| AntD's `darkAlgorithm` recomputes `colorPrimary`: `#C42D5E` renders as `#AA2953` | Phase 2: pin brand colours per component (Button, Segmented, Tabs) so pink matches the token exactly. Good case-study point. |
| Layer order verified in the browser: AntD emits into `@layer antd`; Tailwind's reset leaves AntD borders intact; a plain utility (`rounded-full`) overrides AntD without `!` | No change |

### Findings from the ui/ wrappers (phase 2)

| Finding | Resolution |
|---|---|
| Brand pink shift from `darkAlgorithm` | Resolved: every brand surface sets `bg-brand` in its wrapper; measured `#C42D5E` on Charge, the active segment and the tab strip |
| Figma's active Tab has 12px **concave curves** at both top corners (not in the brief) | Drawn in `ui/Tabs` as two small SVGs in `text-surface`; AntD's nav-wrap set to `overflow-visible` so they show |
| Figma Table pill is padding **3**/12 (22 tall), brief says 4/12 | Followed Figma. AntD Tag keeps a 1px transparent border, removed with `border-0` |
| Figma Button component is 60 tall; the final screen uses 56 | Followed the final screen (56) |
| Custom filled icons have "cut" layers that take the button colour | `ui/icons.tsx` uses `currentColor` for the shape and `--icon-cutout` (default `--bg-surface`) for cuts, instead of the export's hex |
| `tailwind-merge` reads `shadow-tile` as a shadow *colour* | `lib/cn.ts` registers the custom shadow names; `tv` uses the same merger |
| Brief: divider on "each inactive tab… except after active" would put one before the first tab | Also skipped on the first tab |
| Raised pressed overlay | Done as a `background-image` gradient layer (`overlayPressed` in `lib/cn.ts`): above the fill, below the content, no extra element |

### Findings from the static layout (phase 3)

Measured at 1194 × 834 against Figma 257:21144: surface 850 × 754, header 818 × 56, grid 818 × 650 with every cell **150.8 × 150.5**, tabs 163.6 × 64, order panel sections at y 16 / 88 / 630 / 698. All match.

| Finding | Resolution |
|---|---|
| Table pill is 24 tall on the final screen (padding 4/12, as the brief says), 22 on the component sheet | Final screen wins: padding 4/12 (reverses the phase 2 choice) |
| Status dot has a 4px ring in a raw rgba with no token | Added `--status-online-ring` (+ `ring-online-ring`) |
| Cashier pill: brief lists `shadow-soft`, the Figma component has none | Followed Figma (no shadow) |
| Gap between Hold/Fire/Print and Charge: brief 10, Figma frame 8 | 8 |
| Iconoir defaults to stroke 1.5 / 24px | `IconoirProvider` in `App.tsx` sets 20px, stroke 2 for every icon |
| Order line qty shows "2x" in the component, "2×" on the final screen | "×" |

### Findings from the tiles (phase 4)

| Finding | Resolution |
|---|---|
| Product tile radius: component sheet 10, final screen and brief 12 | 12 |
| Sold-out name: component sheet `text-faint`, final screen and brief `text-disabled` | `text-disabled` |
| Badges on the final screen: 24 tall, **2px `bg-surface` border** (reads as cut out of the surface), count 26 wide, best seller fixed 27 wide; not in the brief | Followed the final screen. The ★ glyph is wider than the padding allows, so best seller is a fixed 27 |
| Box-shadow insets are covered by the tint and strip layers | `TileShell` draws `shadow-tile` once, on a top "edge" layer, as Figma does; the shell carries only the outer `drop-shadow-tile`. (A first version also put `shadow-tile` on the shell; its insets showed through the transparent tint and doubled the bottom edge to ~38%. Fixed and checked by pixel sampling against the Figma render: bottom edge (30, 32, 44) vs Figma (30, 32, 40).) |
| Folder: `clip-path` would clip the shadows | One SVG drawn at the cell's fractional size (`useElementSize`, transform-proof), with Figma's exported filters: 1.5px inner bottom edge, inner pressed shadow that follows the cut, exact top-light curves, flap with a rounded inner corner |
| New tokens for the SVG folder | `--effect-inner-edge`, `--effect-inner-pressed`, `--drop-shadow-tile`, `--drop-shadow-flap` (same values as the existing shadow styles) |

Measured: badges sit 8px outside the tile corner with a 4px gap; folder SVG 150.8 × 150.5; at 1180×820 / 1194×834 / 1280×800 / 1366×1024 tiles are 148×147 / 150.8×150.5 / 168×142 / 174×198, names 14 / 14 / 16 / 16, panel 344 / 344 / 344 / 400. All match BRIEF §3.

Component gallery: `?view=gallery` (`src/dev/Gallery.tsx`) shows every wrapper in every state.

---

## 2. Folder structure

```
index.html
vite.config.ts              react + @tailwindcss/vite plugins
wrangler.jsonc              Cloudflare static-assets deploy (SPA fallback)
src/
├─ main.tsx                 createRoot; imports index.css + Inter
├─ App.tsx                  StyleProvider(layer) + ConfigProvider(atlasTheme)
│                           + <OrderStoreProvider><PresentationShell><PosApp/></…>
├─ index.css                @layer order, @import "tailwindcss", @import tokens.css
│
├─ components/
│  ├─ ui/                   AntD wrappers. The ONLY place that imports from "antd".
│  │  ├─ Button.tsx         Primary (Charge), Secondary (Hold/Fire/Print); :active press, no scale
│  │  ├─ IconButton.tsx     48×48, 20px icon, flat pressed state
│  │  ├─ Segmented.tsx      view toggle + device switcher; sliding Motion thumb
│  │  ├─ Tabs.tsx           category tabs: sliding active surface + strip (Motion), dividers
│  │  ├─ Breadcrumb.tsx     48px crumbs, nav-arrow-right separator
│  │  ├─ Tag.tsx            table pill "T1"
│  │  └─ icons.tsx          filled map / view-grid / fire-flame / printer (from Figma)
│  │
│  ├─ tiles/                Custom. No library equivalent.
│  │  ├─ TileShell.tsx      base + tint (overlay blend) + strip + press overlay; highlight/disabled props
│  │  ├─ ProductTile.tsx    name, sold-out, badges
│  │  ├─ FolderTile.tsx     SVG shape: cut corner, flap, top highlight
│  │  ├─ ActionTile.tsx     Open item + Back
│  │  ├─ EmptySlot.tsx
│  │  └─ TileBadge.tsx      count + best-seller pills (offset −8/−8)
│  │
│  ├─ pos/                  Screen sections, composed from ui/ + tiles/
│  │  ├─ PosApp.tsx         root row, @container/app (container-type: size)
│  │  ├─ Header/            Header.tsx, CashierPill.tsx
│  │  ├─ MenuGrid.tsx       5×4 grid, renders cells from selectors
│  │  ├─ CategoryTabs.tsx
│  │  └─ OrderPanel/        OrderPanel.tsx, OrderHeader, OrderLine, Totals, OrderActions
│  │
│  └─ shell/                Presentation only; knows nothing about the order
│     ├─ PresentationShell.tsx  device vs framed mode, scale, too-small message
│     ├─ DeviceFrame.tsx        sized frame, transform: scale, Motion resize
│     └─ DeviceSwitcher.tsx     uses ui/Segmented, syncs ?device=
│
├─ store/
│  ├─ order-reducer.ts      pure reducer + initial state (no React; testable)
│  ├─ order-reducer.test.ts Vitest: totals, add/append, sold out, folders, tabs
│  ├─ context.ts            usePosState / usePosDispatch (split contexts)
│  └─ OrderStoreProvider.tsx reads ?order=empty, mounted above the shell
├─ data/
│  ├─ menu.json
│  ├─ menu.ts               normalises menu.json once (cents, tagged cells)
│  ├─ types.ts
│  └─ selectors.ts          cellsFor(tab, folder), breadcrumb, line totals, totals
├─ dev/Gallery.tsx         ?view=gallery: every ui/ component in every state
├─ lib/
│  ├─ cn.ts                 cn() + tv() with custom shadow names; overlayPressed
│  ├─ motion.ts             motion tokens for JS (mirrors tokens.css) + presets: selectionSlide, frameResize
│  ├─ motion.test.ts        fails if motion.ts and tokens.css drift apart
│  ├─ useElementSize.ts     fractional element size (ResizeObserver), used by FolderTile
│  ├─ money.ts              cents, formatting (incl. "−$3.00"), rounding
│  └─ devices.ts            air11 / pro11 / android10 / pro13
└─ theme/
   ├─ tokens.css            from tokens_1.css, plus the additions in §1
   └─ antd-theme.ts         semantic tokens → AntD token + component tokens
```

### Rules

- **Dependency direction:** `pos` → `ui` + `tiles`. `ui` and `tiles` never import from `pos`. `shell` wraps the app and never reads the store.
- **No `antd` imports outside `components/ui/`**, enforced with ESLint `no-restricted-imports`.
- **One file per component.** A component gets a folder only when it has single-use sub-parts (`OrderPanel/`, `Header/`). No `index.ts` barrels.
- **Tailwind theme names only:** `bg-surface`, `text-muted`, `shadow-tile`, `rounded-lg`. No arbitrary colours (`bg-[#…]`) and no primitive variables in components. Arbitrary values are fine for sizes from the spec (`h-[56px]` → prefer spacing scale where it exists).
- **Naming trap:** in this token set `primary` / `secondary` are *text* colours (`text-primary`). The brand colour is `brand` (`bg-brand`). Never use `bg-primary` for brand.
- **Variants live in `tailwind-variants` definitions** at the top of each component file, not in long inline ternaries.
- **AntD internals are overridden only inside the `ui/` wrapper**, via AntD's `classNames` / `styles` props or Tailwind arbitrary variants (`[&_.ant-tabs-ink-bar]:hidden`), and AntD component tokens.
- **Container queries, never viewport media queries:** `@container/app` on `PosApp` (`@min-[1366px]/app:w-[400px]`), `@container` on each tile (`@min-[160px]:text-base`).
- **Training mode readiness:** `highlight` / `disabled` live on `TileShell`; one store.

---

## 3. Tokens: one source, two outputs

Tailwind reads the CSS variables through the `@theme inline` block already in `tokens.css`. AntD needs resolved hex values in JS (it derives hover/active shades), so `antd-theme.ts` maps the same semantic tokens to AntD names. For the prototype it holds the hex values with a comment naming the CSS token for each. A generator from a shared `tokens.json` is a stretch goal (phase 8).

| Semantic token | Tailwind name | AntD token |
|---|---|---|
| `--accent-brand` | `brand` | `colorPrimary` |
| `--bg-app` | `app` | `colorBgLayout` |
| `--bg-surface` | `surface` | `colorBgContainer` |
| `--bg-raised` | `raised` | `colorBgElevated` |
| `--text-primary` | `primary` | `colorText` |
| `--text-secondary` | `secondary` | `colorTextSecondary` |
| `--text-muted` | `muted` | `colorTextTertiary` |
| `--text-disabled` | `disabled` | `colorTextDisabled` |
| `--border-divider` | `divider` | `colorBorder` |
| `--status-online` | `online` | `colorSuccess` |
| `--radius-sm` / `--radius-lg` | `rounded-sm` / `rounded-lg` | `borderRadius` / `borderRadiusLG` |
| Inter | `font-sans` | `fontFamily` |
| 48px tap target | `size-12` | `controlHeight` |

Global AntD config: `wave={{ disabled: true }}` (pressed states are our own CSS `:active` styles).

---

## 4. Phases

### Phase 0 · Setup
- `npm create vite` (React + TypeScript template), add `@tailwindcss/vite`.
- Install `antd`, `@ant-design/cssinjs` (for `StyleProvider`), `motion`, `iconoir-react`, `clsx`, `tailwind-merge`, `tailwind-variants`, `@fontsource-variable/inter`. Confirm the solid-icon import path and AntD major version at install.
- Copy `tokens_1.css` → `src/theme/tokens.css`; add `--bg-overlay-pressed`, `--bg-presentation` and their `@theme` mappings.
- `index.css`: layer order `theme, base, antd, components, utilities`; `StyleProvider layer` so AntD emits into the `antd` layer.
- Copy `menu.json` → `src/data/`.
- `App.tsx` with StyleProvider, ConfigProvider (stub theme); Inter imported in `main.tsx`.
- ESLint `no-restricted-imports` rule for `antd`.
- `git init` + first commit.
- **Done when:** a test AntD Button renders in brand pink, and a Tailwind `bg-surface` div next to it renders the right colour, with neither breaking the other.

### Phase 1 · Data and store
- Types for items, folders, tabs, layout cells.
- Reducer actions: `addItem`, `setTab` (also closes folder), `openFolder`, `closeFolder`.
- Selectors: `cellsFor(tab, folder)` (folder view = Back + items, padded to 20), breadcrumb, qty per item, subtotal, total.
- `money.ts`: cents internally; total = round(subtotal × 1.2 to 10¢); `$12.90` / `−$3.00`.
- `?order=empty` starts with no lines.
- **Done when:** initial order computes $42.70 / $51.20; adding an existing item increments in place, a new one appends at the bottom.

### Phase 2 · AntD theme and `ui/` wrappers
- Fill `antd-theme.ts` (global + component tokens for Button, Tabs, Segmented, Breadcrumb, Tag).
- Build each wrapper: Button (Primary/Secondary, Default/Pressed/Disabled), IconButton, Segmented, Tabs (strip 5px inset 16, flush bottom; divider rule skipping the tab after active; truncation), Breadcrumb (48px targets, parent pressed colour), Tag.
- **Done when:** each wrapper matches its Figma Components-page variants in isolation.

### Phase 3 · Static layout at 1194 × 834
- `PosApp` row, left column, surface, Header, MenuGrid, CategoryTabs, OrderPanel, with static data.
- Placeholder tiles for now.
- **Done when:** measured in the browser, grid cells are 150.8 × 150.5, and everything outside the tiles lines up with the Figma screenshot.

### Phase 4 · Tiles
- `TileShell` first (layers, `isolate`, overflow rules so badges escape the shell).
- `ProductTile` (default, sold out, badges, name 14/20 → 16/24 at ≥160px via the tile container query).
- `FolderTile`: SVG path with radius 10 + 24px cut; flap with drop shadow; 2px top highlight that stops at the cut; outer shadow via `drop-shadow` filter on a wrapper; pressed overlay follows the shape. **Highest technical risk; check against Figma before moving on.**
- `ActionTile` (Open item, Back), `EmptySlot`, `TileBadge`.
- **Done when:** the Kebabs tab matches Figma tile for tile.

### Phase 5 · Interaction and press states
- Tile press via CSS `:active` (`shadow-pressed` + overlay, no scale; folder: inset shadow + overlay following the cut corner); buttons already done in phase 2; flat press (`bg-raised`) for tabs, icon buttons, toggle segments, order lines; cashier pill pressed = `bg-surface`.
- Wire tap to add, folders, Back, breadcrumb, tabs. Sold-out: no press, no tap.
- Live totals and Charge label; Disabled actions on empty order.
- **Done when:** every item in BRIEF §1 "In scope" works on mouse and touch.

### Phase 6 · Responsive
- Container queries on `@container/app`: order panel 400 at ≥1366 wide. No viewport media queries.
- **Done when:** tile sizes match the BRIEF §3 table on all four devices.

### Phase 7 · Presentation shell
- Mode detection before first render (`pointer: coarse` and ≥1180 × 800 → device mode); no server render, so no flash.
- Framed mode: `bg-presentation` page, frame radius 24, 1px divider outline, large soft shadow; scale = min(1, (w−64)/dw, (h−136)/dh), origin top centre; recalculated on resize.
- DeviceSwitcher (ui/Segmented) + "1194 × 834 · 86%" readout; `?device=` in the URL; default `pro11`.
- Store above the frame, so switching keeps the order, folder and tab.
- Too-small message below 0.5 scale.
- Motion resize ~250ms.
- **Done when:** all four devices switch smoothly with state intact; a real iPad shows device mode.

### Phase 8 · QA, deploy, case study
- Side-by-side check with Figma at 1194 × 834; check all four devices; real-tablet check.
- `vite build`, deploy `dist/` to Cloudflare with `wrangler deploy` (free `*.workers.dev` URL).
- Case study write-up:
  - why AntD + Tailwind + custom components; what AntD covered vs. what needed overrides vs. what was custom;
  - the token table (§3): one set of semantic tokens feeding both Tailwind and AntD, and the "AntD needs hex" finding;
  - the `components/ui` wrapper boundary and its ESLint rule;
  - how AntD and Tailwind coexist (cascade layers);
  - built and deployed like their frontends: static SPA on Cloudflare;
  - screenshots per device, and a short screen recording of the interactions.
- Stretch: generate `tokens.css` and `antd-theme.ts` from one `tokens.json`.

---

## 5. Known risks

| Risk | Mitigation |
|---|---|
| Folder tile shape + shadows (`clip-path` clips `box-shadow`) | SVG shape, `drop-shadow` filter on wrapper; build and compare early (phase 4) |
| AntD Tabs styling is far from the design | Override in `ui/Tabs`; fallback: AntD Tabs for behaviour, custom tab bar via `renderTabBar` |
| Tailwind's reset (preflight) breaking AntD, or AntD styles beating utilities | Cascade layer order from phase 0; verify with the phase 0 "done when" check |
| Long Tailwind class strings on layered tiles | `tailwind-variants` definitions per component; split layers into small sub-elements |
| Tint blending with the surface instead of the base | `isolate` on the shell |
| Cloudflare deploy needs an account and `wrangler login` | You run the login once; fallback is Firebase Hosting or any static host |
