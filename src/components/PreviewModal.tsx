import { useRef, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Printer, Loader2 } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useFichaStore } from '@/store/fichaStore'
import PageRenderer from '@/components/canvas/PageRenderer'
import Page1Overlay from '@/components/pages/Page1Overlay'
import Page2Overlay from '@/components/pages/Page2Overlay'
import Page3Overlay from '@/components/pages/Page3Overlay'
import Page4Overlay from '@/components/pages/Page4Overlay'
import { A4_WIDTH, A4_HEIGHT } from '@/components/canvas/A4Canvas'
import type { FichaPage } from '@/types'
import { applyHtml2CanvasSafeStyles } from '@/utils/html2canvasSafe'
import CustomFontStyles from '@/components/CustomFontStyles'

interface PreviewModalProps {
  open: boolean
  onClose: () => void
}

// Fits a single A4 page in ~680px dialog width
const PREVIEW_SCALE = 0.75

export default function PreviewModal({ open, onClose }: PreviewModalProps) {
  const { currentFicha } = useFichaStore()
  const innerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null])
  const [exporting, setExporting] = useState(false)
  const [printing, setPrinting] = useState(false)

  if (!currentFicha) return null

  const capturePages = async () => {
    const images: string[] = []
    for (let i = 0; i < 4; i++) {
      const el = innerRefs.current[i]
      if (!el) continue
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        onclone: applyHtml2CanvasSafeStyles,
      })
      images.push(canvas.toDataURL('image/png'))
    }
    return images
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const images = await capturePages()
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      images.forEach((imgData, i) => {
        if (i > 0) doc.addPage()
        doc.addImage(imgData, 'PNG', 0, 0, 210, 297)
      })
      doc.save(`${currentFicha.title || 'ficha'}-${Date.now()}.pdf`)
    } catch (err) {
      console.error('Export failed:', err)
      alert('Error al exportar PDF. Inténtalo de nuevo.')
    } finally {
      setExporting(false)
    }
  }

  const handlePrint = async () => {
    setPrinting(true)
    try {
      const images = await capturePages()
      // Build print-root with captured images
      let printRoot = document.getElementById('print-root')
      if (!printRoot) {
        printRoot = document.createElement('div')
        printRoot.id = 'print-root'
        document.body.appendChild(printRoot)
      }
      printRoot.innerHTML = images.map((src) =>
        `<div class="a4-print-page"><img src="${src}" style="width:100%;height:100%;display:block;" /></div>`
      ).join('')
      window.print()
      printRoot.innerHTML = ''
    } catch (err) {
      console.error('Print failed:', err)
      alert('Error al preparar la impresión. Inténtalo de nuevo.')
    } finally {
      setPrinting(false)
    }
  }

  const pages = currentFicha.pages

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent
        className="overflow-y-auto"
        style={{
          maxWidth: A4_WIDTH * PREVIEW_SCALE + 80,
          width: '95vw',
          maxHeight: '92vh',
        }}
      >
        <CustomFontStyles fonts={currentFicha.customFonts} />
        <DialogHeader>
          <DialogTitle>Vista previa — {currentFicha.title}</DialogTitle>
        </DialogHeader>

        {/* Pages stacked vertically — no horizontal scroll needed */}
        <div className="flex flex-col items-center gap-6 py-2">
          {pages.map((page: FichaPage, i: number) => (
            <div key={i} className="flex flex-col items-center gap-1 w-full">
              <span className="text-xs text-gray-400 font-medium self-start">Página {i + 1}</span>
              {/* Clipping wrapper at scaled dimensions */}
              <div
                className="relative bg-white shadow border border-gray-200 overflow-hidden"
                style={{
                  width: A4_WIDTH * PREVIEW_SCALE,
                  height: A4_HEIGHT * PREVIEW_SCALE,
                  flexShrink: 0,
                }}
              >
                {/* Inner 1x div — CSS scaled for display, ref used for html2canvas */}
                <div
                  ref={(el) => { innerRefs.current[i] = el }}
                  className="relative bg-white"
                  data-html2canvas-safe
                  style={{
                    width: A4_WIDTH,
                    height: A4_HEIGHT,
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: 'top left',
                    pointerEvents: 'none',
                  }}
                >
                  {/* Same overlays as editor */}
                  {page.type === 'visual' && (
                    <Page1Overlay ficha={currentFicha} readOnly />
                  )}
                  {page.type === 'graphic' && (
                    <Page2Overlay
                      page={page}
                      ficha={currentFicha}
                      onUpdatePage={() => {}}
                      onUpdateFicha={() => {}}
                      readOnly
                    />
                  )}
                  {page.type === 'technical' && (
                    <Page3Overlay
                      page={page}
                      ficha={currentFicha}
                      onUpdatePage={() => {}}
                      readOnly
                    />
                  )}
                  {page.type === 'phases' && (
                    <Page4Overlay
                      page={page}
                      onUpdatePage={() => {}}
                      readOnly
                    />
                  )}
                  {'elements' in page && (
                    <PageRenderer
                      page={page}
                      showAnnotations={page.type === 'visual' ? page.showAnnotations : true}
                    />
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end gap-2 pt-3 border-t bg-white sticky bottom-0 pb-1">
          <Button variant="outline" onClick={handlePrint} disabled={printing || exporting}>
            {printing ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Printer className="w-4 h-4 mr-2" />}
            {printing ? 'Preparando...' : 'Imprimir'}
          </Button>
          <Button onClick={handleExport} disabled={exporting || printing}>
            {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
            {exporting ? 'Exportando...' : 'Exportar PDF'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
