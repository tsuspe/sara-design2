export function applyHtml2CanvasSafeStyles(doc: Document) {
  const style = doc.createElement('style')
  style.textContent = `
    [data-html2canvas-safe],
    [data-html2canvas-safe] * {
      box-shadow: none !important;
      text-shadow: none !important;
    }
  `
  doc.head.appendChild(style)
}
