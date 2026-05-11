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
import type { Ficha, FichaPage } from '@/types'
import CustomFontStyles from '@/components/CustomFontStyles'

interface PreviewModalProps {
  open: boolean
  onClose: () => void
}

const PREVIEW_SCALE = 0.75

function PageContent({ page, ficha, readOnly = false, onUpdatePage, onUpdateFicha }: {
  page: FichaPage
  ficha: Ficha | null
  readOnly?: boolean
  onUpdatePage?: () => void
  onUpdateFicha?: () => void
}) {
  if (!ficha) return null
  return (
    <>
      {page.type === 'visual' && (
        <Page1Overlay ficha={ficha} readOnly={readOnly} />
      )}
      {page.type === 'graphic' && (
        <Page2Overlay
          page={page}
          ficha={ficha}
          onUpdatePage={onUpdatePage || (() => {})}
          onUpdateFicha={onUpdateFicha || (() => {})}
          readOnly={readOnly}
        />
      )}
      {page.type === 'technical' && (
        <Page3Overlay
          page={page}
          ficha={ficha}
          onUpdatePage={onUpdatePage || (() => {})}
          readOnly={readOnly}
        />
      )}
      {page.type === 'phases' && (
        <Page4Overlay
          page={page}
          onUpdatePage={onUpdatePage || (() => {})}
          readOnly={readOnly}
        />
      )}
      {'elements' in page && (
        <PageRenderer
          page={page}
          showAnnotations={page.type === 'visual' ? page.showAnnotations : true}
        />
      )}
    </>
  )
}

export default function PreviewModal({ open, onClose }: PreviewModalProps) {
  const { currentFicha } = useFichaStore()
  // Refs to hidden full-size pages (no transform) for capture
  const captureRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null])
  const [exporting, setExporting] = useState(false)

  if (!currentFicha) return null

  const pages = currentFicha.pages

  const capturePages = async () => {
    const images: string[] = []
    for (let i = 0; i < 4; i++) {
      const el = captureRefs.current[i]
      if (!el) continue
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: A4_WIDTH,
        height: A4_HEIGHT,
      })
      images.push(canvas.toDataURL('image/png'))
    }
    return images
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const images = await capturePages()
      if (images.length === 0) throw new Error('No pages captured')
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

  const handlePrint = () => {
    window.print()
  }

  return (
    <>
      {/* Hidden full-size pages for html2canvas capture + print */}
      <div
        id="print-root"
        style={{
          position: 'fixed',
          left: '-9999px',
          top: 0,
          zIndex: -1,
        }}
      >
        <CustomFontStyles fonts={currentFicha.customFonts} />
        {pages.map((page: FichaPage, i: number) => (
          <div
            key={i}
            ref={(el) => { captureRefs.current[i] = el }}
            className="a4-print-page relative bg-white"
            style={{
              width: A4_WIDTH,
              height: A4_HEIGHT,
              overflow: 'hidden',
            }}
          >
            <PageContent page={page} ficha={currentFicha} readOnly />
          </div>
        ))}
      </div>

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

          {/* Visual preview — scaled down for display only */}
          <div className="flex flex-col items-center gap-6 py-2">
            {pages.map((page: FichaPage, i: number) => (
              <div key={i} className="flex flex-col items-center gap-1 w-full">
                <span className="text-xs text-gray-400 font-medium self-start">Página {i + 1}</span>
                <div
                  className="relative bg-white shadow border border-gray-200 overflow-hidden"
                  style={{
                    width: A4_WIDTH * PREVIEW_SCALE,
                    height: A4_HEIGHT * PREVIEW_SCALE,
                    flexShrink: 0,
                  }}
                >
                  <div
                    className="relative bg-white"
                    style={{
                      width: A4_WIDTH,
                      height: A4_HEIGHT,
                      transform: `scale(${PREVIEW_SCALE})`,
                      transformOrigin: 'top left',
                      pointerEvents: 'none',
                    }}
                  >
                    <PageContent page={page} ficha={currentFicha} readOnly />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t bg-white sticky bottom-0 pb-1">
            <Button variant="outline" onClick={handlePrint} disabled={exporting}>
              <Printer className="w-4 h-4 mr-2" /> Imprimir
            </Button>
            <Button onClick={handleExport} disabled={exporting}>
              {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              {exporting ? 'Exportando...' : 'Exportar PDF'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
