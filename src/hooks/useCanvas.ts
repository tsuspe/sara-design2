import { useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { useFichaStore } from '@/store/fichaStore'
import type { CanvasElement, CanvasElementType } from '@/types'

export function useCanvas() {
  const {
    currentFicha,
    currentPageIndex,
    selectedElementId,
    setSelectedElementId,
    addElement,
    updateElement,
    removeElement,
    reorderElement,
  } = useFichaStore()

  const currentPage = currentFicha?.pages[currentPageIndex] ?? null

  const createElement = useCallback(
    (type: CanvasElementType, overrides: Partial<CanvasElement> = {}): CanvasElement => {
      const base = {
        id: uuidv4(),
        type,
        position: { x: 100, y: 100 },
        size: { w: 200, h: 200 },
        rotation: 0,
        zIndex: (currentPage?.elements.length ?? 0),
        visible: true,
      }
      if (type === 'text') {
        return {
          ...base,
          type: 'text',
          content: 'Texto',
          fontSize: 16,
          fontFamily: 'sans-serif',
          fontWeight: 'normal',
          fontStyle: 'normal',
          color: '#000000',
          align: 'left',
          ...overrides,
        } as CanvasElement
      }
      if (type === 'label') {
        return {
          ...base,
          type: 'label',
          content: 'Etiqueta',
          fontSize: 12,
          color: '#000000',
          backgroundColor: '#ffffff',
          size: { w: 120, h: 32 },
          ...overrides,
        } as CanvasElement
      }
      if (type === 'arrow') {
        return {
          ...base,
          type: 'arrow',
          color: '#000000',
          strokeWidth: 2,
          size: { w: 100, h: 40 },
          ...overrides,
        } as CanvasElement
      }
      if (type === 'shape') {
        return {
          ...base,
          type: 'shape',
          shape: 'rect',
          fill: 'transparent',
          stroke: '#000000',
          strokeWidth: 2,
          opacity: 1,
          ...overrides,
        } as CanvasElement
      }
      // image — caller must provide src via overrides
      return {
        ...base,
        type: 'image',
        src: '',
        opacity: 1,
        ...overrides,
      } as CanvasElement
    },
    [currentPage]
  )

  return {
    currentPage,
    selectedElementId,
    setSelectedElementId,
    addElement,
    updateElement,
    removeElement,
    reorderElement,
    createElement,
  }
}
