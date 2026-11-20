import { theme, type ThemeConfig } from 'antd'

/*
 * Semantic tokens from tokens.css, mapped to AntD theme tokens.
 * AntD derives hover/active/disabled shades from these values, so it needs
 * resolved hex (not var(--…)). Each value names its CSS token; keep in sync.
 *
 * Note: darkAlgorithm recomputes colorPrimary (#C42D5E renders as #AA2953).
 * So every brand-coloured surface (Charge, active toggle, tab strip) sets
 * bg-brand explicitly in its ui/ wrapper; AntD's primary only drives focus rings.
 */
const t = {
  brand: '#C42D5E', // --accent-brand (pink-500)
  app: '#14151D', // --bg-app (neutral-925)
  surface: '#23242D', // --bg-surface (neutral-750)
  raised: '#1F1F29', // --bg-raised (neutral-800)
  inset: '#0E0E13', // --bg-inset (neutral-950)
  textPrimary: '#F4F5F7', // --text-primary (neutral-100)
  textSecondary: '#C9CCD6', // --text-secondary (neutral-200)
  textMuted: '#A9AEBB', // --text-muted (neutral-300)
  textDisabled: '#878996', // --text-disabled (neutral-400)
  divider: '#3D3E4D', // --border-divider (neutral-600)
  online: '#59AD73', // --status-online (green-400)
}

export const atlasTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: t.brand,
    colorBgLayout: t.app,
    colorBgContainer: t.surface,
    colorBgElevated: t.raised,
    colorText: t.textPrimary,
    colorTextSecondary: t.textSecondary,
    colorTextTertiary: t.textMuted,
    colorTextDisabled: t.textDisabled,
    colorBorder: t.divider,
    colorSuccess: t.online,
    borderRadius: 8, // --radius-sm
    borderRadiusLG: 12, // --radius-lg
    fontFamily: '"Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif',
    controlHeight: 48, // 48px minimum tap target
    motion: false, // Motion (motion/react) owns press + transition feedback
  },
  components: {
    Button: {
      primaryShadow: 'none',
      defaultShadow: 'none',
      dangerShadow: 'none',
    },
    Segmented: {
      trackBg: t.inset,
      trackPadding: 0,
      itemColor: t.textSecondary,
      itemHoverColor: t.textSecondary,
      itemHoverBg: 'transparent',
      itemActiveBg: t.raised,
      itemSelectedBg: t.brand,
      itemSelectedColor: '#FFFFFF', // --text-on-accent (neutral-0)
    },
    Tabs: {
      horizontalMargin: '0',
      horizontalItemGutter: 4,
      horizontalItemPadding: '0',
      itemColor: t.textMuted,
      itemHoverColor: t.textMuted,
      itemActiveColor: t.textMuted,
      itemSelectedColor: t.textPrimary,
      inkBarColor: t.brand,
    },
    Breadcrumb: {
      separatorMargin: 8,
      itemColor: t.textMuted,
      lastItemColor: t.textPrimary,
      linkColor: t.textMuted,
      linkHoverColor: t.textMuted,
      separatorColor: t.textMuted,
    },
  },
}
