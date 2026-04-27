import { useRef } from 'react'
import { useFichaStore } from '@/store/fichaStore'
import CanvasElementWrapper from './CanvasElementWrapper'
import type { CanvasElement, FichaPage } from '@/types'
import Page1Overlay from '@/components/pages/Page1Overlay'
import Page2Overlay from '@/components/pages/Page2Overlay'
import Page3Overlay from '@/components/pages/Page3Overlay'

interface Props {
  pageRef?: React.RefObject<HTMLDivElement | null>  // for html2canvas export
}

// A4 at 96dpi: 794×1123px; margin guide 38px (~10mm)
export const A4_WIDTH = 794
export const A4_HEIGHT = 1123
export const A4_MARGIN = 38

export default function A4Canvas({ pageRef }: Props) {
  const internalRef = useRef<HTMLDivElement>(null)
  const ref = pageRef ?? internalRef

  const {
    currentFicha,
    currentPageIndex,
    updateElement,
    setSelectedElementId,
    selectedElementId,
    updateCurrentPage,
    updateFichaField,
  } = useFichaStore()

  const page = currentFicha?.pages[currentPageIndex]

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) setSelectedElementId(null)
  }

  if (!page) return null

  return (
    <div className="flex-1 bg-gray-100 overflow-auto p-8">
      {/* A4 page — centered horizontally via margin auto */}
      <div
        ref={ref}
        onClick={handleCanvasClick}
        className="relative bg-white shadow-lg"
        style={{ width: A4_WIDTH, height: A4_HEIGHT, flexShrink: 0, margin: '0 auto' }}
      >
        {/* Margin guides (dashed, only visible in editor — not captured by html2canvas if hidden during export) */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            border: `1px dashed rgba(0,0,0,0.15)`,
            margin: A4_MARGIN,
          }}
        />

        {/* Page overlays (rendered below canvas elements so elements float on top) */}
        {page.type === 'visual' && (
          <Page1Overlay
            ficha={currentFicha}
            onUpdateFicha={(changes) => updateFichaField(changes)}
          />
        )}
        {page.type === 'graphic' && (
          <Page2Overlay
            page={page}
            ficha={currentFicha}
            onUpdatePage={(changes) => updateCurrentPage(changes as Partial<FichaPage>)}
            onUpdateFicha={(changes) => updateFichaField(changes)}
          />
        )}
        {page.type === 'technical' && (
          <Page3Overlay
            page={page}
            ficha={currentFicha}
            onUpdatePage={(changes) => updateCurrentPage(changes as Partial<FichaPage>)}
          />
        )}

        {/* Render elements sorted by zIndex */}
        {[...page.elements]
          .sort((a, b) => a.zIndex - b.zIndex)
          .map((element) => (
            <CanvasElementWrapper
              key={element.id}
              element={element}
              isSelected={selectedElementId === element.id}
              onSelect={() => setSelectedElementId(element.id)}
              onUpdate={(changes) => updateElement(element.id, changes as Partial<CanvasElement>)}
            />
          ))}
      </div>
    </div>
  )
}
