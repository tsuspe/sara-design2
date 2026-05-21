import { useRef, useState, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Printer, Loader2, Image as ImageIcon } from 'lucide-react'
import jsPDF from 'jspdf'
import { toPng } from 'html-to-image'
import { useFichaStore } from '@/store/fichaStore'
import PageRenderer from '@/components/canvas/PageRenderer'
import Page1Overlay from '@/components/pages/Page1Overlay'
import Page2Overlay from '@/components/pages/Page2Overlay'
import Page3Overlay from '@/components/pages/Page3Overlay'
import Page4ScalingOverlay from '@/components/pages/Page4ScalingOverlay'
import Page4Overlay from '@/components/pages/Page4Overlay'
import { A4_WIDTH, A4_HEIGHT } from '@/components/canvas/A4Canvas'
import type { Ficha, FichaPage } from '@/types'
import CustomFontStyles from '@/components/CustomFontStyles'

interface PreviewModalProps {
  open: boolean
  onClose: () => void
}

const PREVIEW_SCALE = 0.75

function PageContent({ page, ficha }: {
  page: FichaPage
  ficha: Ficha
}) {
  return (
    <>
      {page.type === 'visual' && (
        <Page1Overlay ficha={ficha} readOnly />
      )}
      {page.type === 'graphic' && (
        <Page2Overlay
          page={page}
          ficha={ficha}
          onUpdatePage={() => {}}
          onUpdateFicha={() => {}}
          readOnly
        />
      )}
      {page.type === 'technical' && (
        <Page3Overlay
          page={page}
          ficha={ficha}
          onUpdatePage={() => {}}
          readOnly
        />
      )}
      {page.type === 'scaling' && (
        <Page4ScalingOverlay
          page={page}
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
    </>
  )
}

export default function PreviewModal({ open, onClose }: PreviewModalProps) {
  const { currentFicha } = useFichaStore()
  const captureRefs = useRef<(HTMLDivElement | null)[]>([null, null, null, null, null])
  const [exporting, setExporting] = useState(false)
  const [printContainer, setPrintContainer] = useState<HTMLDivElement | null>(null)

  // Create a container as direct child of body for print CSS to work
  useEffect(() => {
    if (!open) return
    let container = document.getElementById('print-root') as HTMLDivElement | null
    if (!container) {
      container = document.createElement('div')
      container.id = 'print-root'
      document.body.appendChild(container)
    }
    setPrintContainer(container)
    return () => {
      // Clean up on close
      if (container && container.parentNode) {
        container.parentNode.removeChild(container)
      }
      setPrintContainer(null)
    }
  }, [open])

  if (!currentFicha) return null

  const pages = currentFicha.pages

  const capturePageImages = async (): Promise<string[]> => {
    const images: string[] = []
    for (let i = 0; i < pages.length; i++) {
      const el = captureRefs.current[i]
      if (!el) continue
      const dataUrl = await toPng(el, {
        width: A4_WIDTH,
        height: A4_HEIGHT,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })
      images.push(dataUrl)
    }
    return images
  }

  const handleExportPDF = async () => {
    setExporting(true)
    try {
      const images = await capturePageImages()
      if (images.length === 0) throw new Error('No pages captured')
      const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
      images.forEach((imgData, i) => {
        if (i > 0) doc.addPage()
        doc.addImage(imgData, 'PNG', 0, 0, 210, 297)
      })
      doc.save(`${currentFicha.title || 'ficha'}-${Date.now()}.pdf`)
    } catch (err) {
      console.error('Export PDF failed:', err)
      alert('Error al exportar PDF: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setExporting(false)
    }
  }

  const handleExportPNG = async () => {
    setExporting(true)
    try {
      const images = await capturePageImages()
      if (images.length === 0) throw new Error('No pages captured')
      for (let i = 0; i < images.length; i++) {
        const link = document.createElement('a')
        link.download = `${currentFicha.title || 'ficha'}-page${i + 1}-${Date.now()}.png`
        link.href = images[i]
        link.click()
      }
    } catch (err) {
      console.error('Export PNG failed:', err)
      alert('Error al exportar PNG: ' + (err instanceof Error ? err.message : String(err)))
    } finally {
      setExporting(false)
    }
  }

  const handlePrint = () => {
    window.print()
  }

  // Hidden full-size pages rendered into body via portal (for print + capture)
  const hiddenPages = (
    <div
      style={{
        position: 'absolute',
        left: '-9999px',
        top: 0,
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
          <PageContent page={page} ficha={currentFicha} />
        </div>
      ))}
    </div>
  )

  return (
    <>
      {/* Portal: render hidden pages as direct child of body for print CSS */}
      {printContainer && createPortal(hiddenPages, printContainer)}

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
                    <PageContent page={page} ficha={currentFicha} />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t bg-white sticky bottom-0 pb-1">
            <Button variant="outline" onClick={handlePrint} disabled={exporting}>
              <Printer className="w-4 h-4 mr-2" /> Imprimir
            </Button>
            <Button variant="outline" onClick={handleExportPNG} disabled={exporting}>
              {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <ImageIcon className="w-4 h-4 mr-2" />}
              PNG
            </Button>
            <Button onClick={handleExportPDF} disabled={exporting}>
              {exporting ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Download className="w-4 h-4 mr-2" />}
              PDF
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
