import type { ArrowElement, CanvasElement, Ficha, ShapeElement } from '@/types'

const WIDTH = 794
const HEIGHT = 1123

function escapeXml(value: string) {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&apos;')
}

function text(value: string, x: number, y: number, size = 12, extra = '') {
  const fill = extra.includes('fill=') ? '' : 'fill="#111827"'
  return `<text x="${x}" y="${y}" font-family="Arial, sans-serif" font-size="${size}" ${fill} ${extra}>${escapeXml(value || '-')}</text>`
}

function customFontCss(ficha: Ficha) {
  return (ficha.customFonts ?? [])
    .map(
      (font) => `
        @font-face {
          font-family: "${font.family}";
          src: url("${font.dataUrl}") format("${font.format}");
          font-weight: 100 900;
          font-style: normal;
        }`
    )
    .join('\n')
}

function arrowPath(element: ArrowElement) {
  const { size, strokeWidth } = element
  const variant = element.variant ?? 'straight'
  const endX = Math.max(0, size.w - 10)
  const midY = size.h / 2
  const padding = Math.max(strokeWidth, 4)
  if (variant === 'curved') return `M 0 ${midY} Q ${size.w / 2} ${padding} ${endX} ${midY}`
  if (variant === 'elbow') return `M ${padding} ${padding} V ${midY} H ${endX}`
  return `M 0 ${midY} H ${endX}`
}

function renderShape(element: ShapeElement) {
  const { size, fill, stroke, strokeWidth, opacity, shape } = element
  const common = `fill="${fill}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}"`
  if (shape === 'ellipse') {
    return `<ellipse cx="${size.w / 2}" cy="${size.h / 2}" rx="${(size.w - strokeWidth) / 2}" ry="${(size.h - strokeWidth) / 2}" ${common} />`
  }
  if (shape === 'line') {
    return `<line x1="0" y1="${size.h / 2}" x2="${size.w}" y2="${size.h / 2}" stroke="${stroke}" stroke-width="${strokeWidth}" opacity="${opacity}" />`
  }
  if (shape === 'triangle') {
    return `<polygon points="${size.w / 2},${strokeWidth / 2} ${size.w - strokeWidth / 2},${size.h - strokeWidth / 2} ${strokeWidth / 2},${size.h - strokeWidth / 2}" ${common} />`
  }
  if (shape === 'diamond') {
    return `<polygon points="${size.w / 2},${strokeWidth / 2} ${size.w - strokeWidth / 2},${size.h / 2} ${size.w / 2},${size.h - strokeWidth / 2} ${strokeWidth / 2},${size.h / 2}" ${common} />`
  }
  return `<rect x="${strokeWidth / 2}" y="${strokeWidth / 2}" width="${size.w - strokeWidth}" height="${size.h - strokeWidth}" ${common} />`
}

function renderElement(element: CanvasElement) {
  if (!element.visible) return ''
  const transform = `translate(${element.position.x} ${element.position.y}) rotate(${element.rotation} ${element.size.w / 2} ${element.size.h / 2})`

  if (element.type === 'image') {
    return `<g transform="${transform}"><image href="${escapeXml(element.src)}" width="${element.size.w}" height="${element.size.h}" opacity="${element.opacity}" preserveAspectRatio="xMidYMid meet" /></g>`
  }
  if (element.type === 'text') {
    const anchor = element.align === 'center' ? 'middle' : element.align === 'right' ? 'end' : 'start'
    const x = element.align === 'center' ? element.size.w / 2 : element.align === 'right' ? element.size.w : 0
    return `<g transform="${transform}"><text x="${x}" y="${element.fontSize}" font-family="${escapeXml(element.fontFamily)}" font-size="${element.fontSize}" font-weight="${element.fontWeight}" font-style="${element.fontStyle}" fill="${element.color}" text-anchor="${anchor}">${escapeXml(element.content)}</text></g>`
  }
  if (element.type === 'label') {
    return `<g transform="${transform}"><rect width="${element.size.w}" height="${element.size.h}" fill="${element.backgroundColor}" stroke="#d1d5db" rx="4" /><text x="8" y="${element.size.h / 2 + element.fontSize / 3}" font-family="${escapeXml(element.fontFamily ?? 'Arial, sans-serif')}" font-size="${element.fontSize}" font-weight="${element.fontWeight ?? 'normal'}" font-style="${element.fontStyle ?? 'normal'}" fill="${element.color}">${escapeXml(element.content)}</text></g>`
  }
  if (element.type === 'shape') {
    return `<g transform="${transform}">${renderShape(element)}</g>`
  }
  if (element.type === 'arrow') {
    const markerId = `thumb-arrow-${element.id}`
    return `<g transform="${transform}"><defs><marker id="${markerId}" markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto"><path d="M0,0 L6,3 L0,6 Z" fill="${element.color}" /></marker></defs><path d="${arrowPath(element)}" fill="none" stroke="${element.color}" stroke-width="${element.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" marker-end="url(#${markerId})" /></g>`
  }
  return ''
}

export function generateFichaThumbnailDataUrl(ficha: Ficha): string {
  const page = ficha.pages[0]
  const elements = [...page.elements]
    .filter((element) => page.showAnnotations || (element.type !== 'arrow' && element.type !== 'label'))
    .sort((a, b) => a.zIndex - b.zIndex)
    .map(renderElement)
    .join('')

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
      <defs>
        <style>${customFontCss(ficha)}</style>
        <pattern id="thumb-grid" width="24" height="24" patternUnits="userSpaceOnUse">
          <path d="M 24 0 L 0 0 0 24" fill="none" stroke="rgba(173,216,230,0.45)" stroke-width="1" />
        </pattern>
      </defs>
      <rect width="${WIDTH}" height="${HEIGHT}" fill="#ffffff" />
      <rect x="12" y="12" width="${WIDTH - 24}" height="${HEIGHT - 24}" fill="none" stroke="#111827" stroke-width="4" />
      <rect x="52" y="178" width="${WIDTH - 104}" height="${HEIGHT - 252}" fill="url(#thumb-grid)" stroke="#111827" stroke-width="3" />
      <rect x="52" y="158" width="${WIDTH - 104}" height="20" fill="#ffffff" stroke="#111827" stroke-width="3" />
      ${text('DETAIL AFTER PURCHASE', WIDTH / 2, 173, 12, `font-family="${ficha.bodyFontFamily ?? 'Arial, sans-serif'}" font-weight="900" text-anchor="middle"`)}
      <rect x="40" y="40" width="${WIDTH - 80}" height="118" fill="#ffffff" stroke="#111827" stroke-width="3" />
      <line x1="40" y1="85" x2="${WIDTH - 40}" y2="85" stroke="#111827" stroke-width="3" />
      ${text(
        (ficha.modelName || ficha.title || 'MODELO').toUpperCase(),
        56,
        78,
        ficha.titleFontSize ?? 46,
        `font-family="${ficha.titleFontFamily ?? 'Impact, sans-serif'}" font-weight="${ficha.titleFontWeight ?? 'bold'}" font-style="${ficha.titleFontStyle ?? 'normal'}" fill="#25385c"`
      )}
      <line x1="${40 + (WIDTH - 80) / 3}" y1="85" x2="${40 + (WIDTH - 80) / 3}" y2="158" stroke="#111827" stroke-width="3" />
      <line x1="${40 + ((WIDTH - 80) / 3) * 2}" y1="85" x2="${40 + ((WIDTH - 80) / 3) * 2}" y2="158" stroke="#111827" stroke-width="3" />
      <line x1="40" y1="109" x2="${WIDTH - 40}" y2="109" stroke="#111827" stroke-width="3" />
      <line x1="40" y1="133" x2="${WIDTH - 40}" y2="133" stroke="#111827" stroke-width="3" />
      ${text('Brand :', 48, 103, 12, 'font-weight="900"')}
      ${text(ficha.brand || 'None', 104, 103, 12, 'font-weight="700"')}
      ${text('Season :', 48, 127, 12, 'font-weight="900"')}
      ${text(ficha.season || 'None', 112, 127, 12, 'font-weight="700"')}
      ${text('Line :', 48, 151, 12, 'font-weight="900"')}
      ${text(ficha.line || 'None', 108, 151, 12, 'font-weight="700"')}
      ${text('Model :', 284, 103, 12, 'font-weight="900"')}
      ${text(ficha.modelName || 'None', 340, 103, 12, 'font-weight="700"')}
      ${text('Article :', 284, 127, 12, 'font-weight="900"')}
      ${text(ficha.article || 'None', 350, 127, 12, 'font-weight="700"')}
      ${text('Size :', 284, 151, 12, 'font-weight="900"')}
      ${text(ficha.size || 'None', 328, 151, 12, 'font-weight="700"')}
      ${text('Date :', 548, 103, 12, 'font-weight="900"')}
      ${text(ficha.emissionDate || new Date().getFullYear().toString(), 594, 103, 12, 'font-weight="700"')}
      ${text('Reception :', 548, 127, 12, 'font-weight="900"')}
      ${text(ficha.receptionDate || 'None', 636, 127, 12, 'font-weight="700"')}
      ${text('Designer :', 548, 151, 12, 'font-weight="900"')}
      ${text(ficha.designerName || 'None', 624, 151, 12, 'font-weight="700"')}
      ${elements}
      <rect x="52" y="${HEIGHT - 72}" width="${WIDTH - 104}" height="50" fill="#ffffff" stroke="#111827" stroke-width="3" />
      ${text(
        (ficha.brand || ficha.designerName || 'SARA DESIGN').toUpperCase(),
        WIDTH / 2,
        HEIGHT - 34,
        34,
        `font-family="${ficha.titleFontFamily ?? 'Impact, sans-serif'}" font-weight="900" text-anchor="middle" fill="#25385c"`
      )}
    </svg>
  `.trim()

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`
}
