export function applyHtml2CanvasSafeStyles(doc: Document) {
  const style = doc.createElement('style')
  style.textContent = `
    [data-html2canvas-safe],
    [data-html2canvas-safe] * {
      color: #111827 !important;
      border-color: #e5e7eb !important;
      outline-color: #3b82f6 !important;
      box-shadow: none !important;
      text-shadow: none !important;
    }
    [data-html2canvas-safe] {
      background-color: #ffffff !important;
    }
    [data-html2canvas-safe] .bg-white {
      background-color: #ffffff !important;
    }
    [data-html2canvas-safe] .bg-gray-50,
    [data-html2canvas-safe] .bg-gray-100 {
      background-color: #f9fafb !important;
    }
    [data-html2canvas-safe] .bg-gray-900 {
      background-color: #111827 !important;
    }
    [data-html2canvas-safe] .bg-gray-900,
    [data-html2canvas-safe] .bg-gray-900 * {
      color: #ffffff !important;
    }
    [data-html2canvas-safe] .text-white {
      color: #ffffff !important;
    }
    [data-html2canvas-safe] .text-gray-300 {
      color: #d1d5db !important;
    }
    [data-html2canvas-safe] .text-gray-400 {
      color: #9ca3af !important;
    }
    [data-html2canvas-safe] .text-gray-500,
    [data-html2canvas-safe] .text-gray-600,
    [data-html2canvas-safe] .text-gray-700 {
      color: #6b7280 !important;
    }
    [data-html2canvas-safe] .text-gray-800,
    [data-html2canvas-safe] .text-gray-900 {
      color: #111827 !important;
    }
  `
  doc.head.appendChild(style)
}
