import { useRef, useCallback } from 'react'
import { toPng } from 'html-to-image'
import jsPDF from 'jspdf'

type PageIdx = 0 | 1 | 2 | 3 | 4
const PAGE_COUNT = 5

export function useExport() {
  const pageRefs = useRef<(HTMLDivElement | null)[]>(Array(PAGE_COUNT).fill(null))

  const capturePage = useCallback(async (index: PageIdx): Promise<string> => {
    const el = pageRefs.current[index]
    if (!el) throw new Error(`Page ${index} ref not set`)
    return toPng(el, {
      pixelRatio: 2,
      backgroundColor: '#ffffff',
    })
  }, [])

  const exportPDF = useCallback(async (fichaTitle: string) => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    for (let i = 0; i < PAGE_COUNT; i++) {
      if (i > 0) doc.addPage()
      const imgData = await capturePage(i as PageIdx)
      doc.addImage(imgData, 'PNG', 0, 0, 210, 297)
    }
    const filename = `${fichaTitle || 'ficha'}-${Date.now()}.pdf`
    doc.save(filename)
  }, [capturePage])

  const generateThumbnail = useCallback(async (): Promise<string> => {
    const el = pageRefs.current[0]
    if (!el) throw new Error('Page 0 ref not set')
    return toPng(el, {
      pixelRatio: 0.25,
      backgroundColor: '#ffffff',
    })
  }, [])

  const setPageRef = useCallback((index: PageIdx, el: HTMLDivElement | null) => {
    pageRefs.current[index] = el
  }, [])

  return { pageRefs, setPageRef, exportPDF, generateThumbnail, capturePage }
}
