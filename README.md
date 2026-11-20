# Atlas POS · Ordering screen prototype

A clickable code prototype of a tablet POS ordering screen, built as a case study for **Atlas Kitchen**, in the stack their frontend apps use: **React with Ant Design + Tailwind CSS**.

**Live:** https://atlas-pos-prototype.sofyanhidayat48.workers.dev

> Prototype only: no backend and no real payments. Menu data is dummy (`src/data/menu.json`).

## Try it

- **On a desktop or laptop** it opens in a device frame with a switcher: iPad Air 11", iPad Pro 11", Android POS 10", iPad Pro 13". The app is laid out at the exact tablet size and scaled to fit.
- **On a tablet in landscape** it fills the screen, with no frame.
- Useful links:
  - `?device=pro13` (or `air11`, `android10`, `pro11`): open a specific device
  - `?order=empty`: start with an empty order (disabled actions)
  - `?view=gallery`: every UI component in every state

What works: tap products to add them (new lines at the bottom, live totals, count badges), open folders (breadcrumb, Back tile), switch category tabs, sold-out tiles do nothing, pressed states everywhere. Charge, Hold / Fire / Print, search and similar controls show their press state only.

## Stack

| | |
|---|---|
| App | Vite + React + TypeScript (static single-page app) |
| UI | Ant Design (wrapped) + custom tiles |
| Styling | Tailwind CSS v4, design tokens from Figma |
| Motion | Motion (`motion/react`) + CSS transitions, timed by motion tokens |
| Icons | Iconoir, plus 4 filled icons exported from Figma |
| Deploy | Cloudflare Workers static assets |

## How it's put together

- **Design tokens** (`src/theme/tokens.css`): primitives → semantic tokens, exported from Figma, mapped into Tailwind's `@theme`. Components use semantic tokens only; there are no hard-coded colours outside the theme.
- **One token set, two consumers:** Tailwind reads the CSS variables; Ant Design's theme (`src/theme/antd-theme.ts`) maps the same semantic tokens to AntD tokens. AntD needs resolved hex values (it derives hover/active shades), so each one names its CSS token.
- **AntD boundary:** only `src/components/ui/` imports `antd`, enforced by an Oxlint `no-restricted-imports` rule. AntD supplies behaviour and accessibility (tablist, radio group, focus, keyboard); the look is set with Tailwind utilities, which sit in a later CSS layer than AntD.
- **Custom tiles** (`src/components/tiles/`): product, folder, Open item, Back. The folder's cut corner is an SVG drawn at the cell's real size, using the same filters Figma exports, so its shadows follow the shape.
- **Responsive by container, not viewport:** the grid is always 5 × 4; the order panel and tile type sizes respond to the app's own size via container queries, which is what lets the presentation shell show any tablet size in a desktop browser.
- **Motion tokens** in `tokens.css`, mirrored in `src/lib/motion.ts` for JS, with a test that fails if the two drift.
- **One store** (`src/store/`): a pure reducer, unit-tested against the brief's rules (e.g. $42.70 → $51.20, new lines at the bottom, sold out ignored).

`PLAN.md` has the full build plan, and a log of every place where the brief and the Figma file disagreed and what was chosen.

## Run locally

```bash
npm install
npm run dev      # http://localhost:5173
npm test         # unit tests (Vitest)
npm run lint     # Oxlint, including the antd import rule
npm run build    # type-check + production build to dist/
npm run deploy   # build + deploy to Cloudflare (needs `npx wrangler login`)
```

## Credits

Design: Atlas POS ordering screen (Figma). Built with Ant Design, Tailwind CSS, Motion and Iconoir.
