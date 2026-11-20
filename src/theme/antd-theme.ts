import { theme, type ThemeConfig } from 'antd'

/*
 * Semantic tokens from tokens.css, mapped to AntD theme tokens.
 * AntD derives hover/active/disabled shades from these values, so it needs
 * resolved hex (not var(--…)). Each value names its CSS token; keep in sync.
 * Phase 2 fills in component tokens.
 */
export const atlasTheme: ThemeConfig = {
  algorithm: theme.darkAlgorithm,
  token: {
    colorPrimary: '#C42D5E', // --accent-brand (pink-500)
    colorBgLayout: '#14151D', // --bg-app (neutral-925)
    colorBgContainer: '#23242D', // --bg-surface (neutral-750)
    colorBgElevated: '#1F1F29', // --bg-raised (neutral-800)
    colorText: '#F4F5F7', // --text-primary (neutral-100)
    colorTextSecondary: '#C9CCD6', // --text-secondary (neutral-200)
    colorTextTertiary: '#A9AEBB', // --text-muted (neutral-300)
    colorTextDisabled: '#878996', // --text-disabled (neutral-400)
    colorBorder: '#3D3E4D', // --border-divider (neutral-600)
    colorSuccess: '#59AD73', // --status-online (green-400)
    borderRadius: 8, // --radius-sm
    borderRadiusLG: 12, // --radius-lg
    fontFamily: '"Inter Variable", "Inter", ui-sans-serif, system-ui, sans-serif',
    controlHeight: 48, // 48px minimum tap target
  },
}
