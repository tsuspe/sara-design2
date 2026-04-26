import { useRef } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Download, Printer } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'
import { useFichaStore } from '@/store/fichaStore'
import PageRenderer from '@/components/canvas/PageRenderer'
import Page2Overlay from '@/components/pages/Page2Overlay'
import Page3Overlay from '@/components/pages/Page3Overlay'
import { A4_WIDTH, A4_HEIGHT } from '@/components/canvas/A4Canvas'
import type { FichaPage } from '@/types'

interface PreviewModalProps {
  open: boolean
  onClose: () => void
}

const PREVIEW_SCALE = 0.6

export default function PreviewModal({ open, onClose }: PreviewModalProps) {
  const { currentFicha } = useFichaStore()
  // Refs to the inner (1x) unscaled divs for html2canvas capture
  const innerRefs = useRef<(HTMLDivElement | null)[]>([null, null, null])

  if (!currentFicha) return null

  const handleExport = async () => {
    const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
    for (let i = 0; i < 3; i++) {
      if (i > 0) doc.addPage()
      const el = innerRefs.current[i]
      if (!el) continue
      const canvas = await html2canvas(el, {
        scale: 2,
        useCORS: true,
        backgroundColor: '#ffffff',
        logging: false,
      })
      doc.addImage(canvas.toDataURL('image/png'), 'PNG', 0, 0, 210, 297)
    }
    doc.save(`${currentFicha.title || 'ficha'}-${Date.now()}.pdf`)
  }

  const handlePrint = () => {
    window.print()
  }

  const pages = currentFicha.pages

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Vista previa — {currentFicha.title}</DialogTitle>
        </DialogHeader>
        <div className="flex gap-4 justify-center flex-wrap py-4">
          {pages.map((page: FichaPage, i: number) => (
            <div key={i} className="flex flex-col items-center gap-2">
              <span className="text-xs text-gray-500">Página {i + 1}</span>
              <div
                className="relative bg-white shadow border overflow-hidden"
                style={{
                  width: A4_WIDTH * PREVIEW_SCALE,
                  height: A4_HEIGHT * PREVIEW_SCALE,
                  flexShrink: 0,
                }}
              >
                <div
                  ref={(el) => { innerRefs.current[i] = el }}
                  style={{
                    transform: `scale(${PREVIEW_SCALE})`,
                    transformOrigin: 'top left',
                    width: A4_WIDTH,
                    height: A4_HEIGHT,
                  }}
                  className="relative bg-white"
                >
                  {/* Page-specific static overlays */}
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
                  {/* Canvas elements */}
                  <PageRenderer
                    page={page}
                    showAnnotations={page.type === 'visual' ? page.showAnnotations : true}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-2 pt-2 border-t">
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" /> Imprimir
          </Button>
          <Button onClick={handleExport}>
            <Download className="w-4 h-4 mr-2" /> Exportar PDF
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
