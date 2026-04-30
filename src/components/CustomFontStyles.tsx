import type { CustomFont } from '@/types'

interface CustomFontStylesProps {
  fonts?: CustomFont[]
}

export default function CustomFontStyles({ fonts = [] }: CustomFontStylesProps) {
  if (fonts.length === 0) return null

  const css = fonts
    .map(
      (font) => `
@font-face {
  font-family: "${font.family}";
  src: url("${font.dataUrl}") format("${font.format}");
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}`
    )
    .join('\n')

  return <style>{css}</style>
}
