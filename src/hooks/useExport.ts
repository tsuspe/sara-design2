import { useRef, useCallback } from 'react'
import html2canvas from 'html2canvas'
import jsPDF from 'jspdf'

export function useExport() {
  const pageRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])

  const capturePage = useCallback(async (index: 0 | 1 | 2): Promise<string> => {
    const el = pageRefs.current[index]
    if (!el) throw new Error(`Page ${index} ref not set`)
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    })
    return canvas.toDataURL('image/png')
  }, [])

  const exportPDF = useCallback(async (fichaTitle: string) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    for (let i = 0; i < 3; i++) {
      if (i > 0) doc.addPage()
      const imgData = await capturePage(i as 0 | 1 | 2)
      doc.addImage(imgData, 'PNG', 0, 0, 210, 297)
    }
    const filename = `${fichaTitle || 'ficha'}-${Date.now()}.pdf`
    doc.save(filename)
  }, [capturePage])

  const generateThumbnail = useCallback(async (): Promise<string> => {
    const el = pageRefs.current[0]
    if (!el) throw new Error('Page 0 ref not set')
    const canvas = await html2canvas(el, {
      scale: 0.25,
      useCORS: true,
      backgroundColor: '#ffffff',
      logging: false,
    })
    return canvas.toDataURL('image/png')
  }, [])

  return { pageRefs, exportPDF, generateThumbnail, capturePage }
}
