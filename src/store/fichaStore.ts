import { create } from 'zustand'
import type { Ficha, FichaPage, CanvasElement, PageIndex } from '@/types'

interface FichaStore {
  // ─── State ─────────────────────────────────────────────────────────────────
  currentFicha: Ficha | null
  currentPageIndex: PageIndex
  selectedElementId: string | null
  isDirty: boolean

  // ─── Ficha actions ──────────────────────────────────────────────────────────
  setCurrentFicha: (ficha: Ficha | null) => void
  updateFichaField: (changes: Partial<Omit<Ficha, 'pages'>>) => void
  markClean: () => void

  // ─── Page actions ────────────────────────────────────────────────────────────
  setCurrentPageIndex: (idx: PageIndex) => void
  updateCurrentPage: (changes: Partial<FichaPage>) => void

  // ─── Element actions ─────────────────────────────────────────────────────────
  setSelectedElementId: (id: string | null) => void
  addElement: (element: CanvasElement) => void
  updateElement: (id: string, changes: Partial<CanvasElement>) => void
  removeElement: (id: string) => void
  reorderElement: (id: string, direction: 'up' | 'down') => void
}

export const useFichaStore = create<FichaStore>((set) => ({
  currentFicha: null,
  currentPageIndex: 0,
  selectedElementId: null,
  isDirty: false,

  setCurrentFicha: (ficha) =>
    set({ currentFicha: ficha, selectedElementId: null, isDirty: false }),

  updateFichaField: (changes) =>
    set((state) => {
      if (!state.currentFicha) return state
      return {
        currentFicha: {
          ...state.currentFicha,
          ...changes,
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
      }
    }),

  markClean: () => set({ isDirty: false }),

  setCurrentPageIndex: (idx) =>
    set({ currentPageIndex: idx, selectedElementId: null }),

  updateCurrentPage: (changes) =>
    set((state) => {
      if (!state.currentFicha) return state
      const pages = [...state.currentFicha.pages] as Ficha['pages']
      const current = pages[state.currentPageIndex]
      pages[state.currentPageIndex] = { ...current, ...changes } as typeof current
      return {
        currentFicha: {
          ...state.currentFicha,
          pages,
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
      }
    }),

  setSelectedElementId: (id) => set({ selectedElementId: id }),

  addElement: (element) =>
    set((state) => {
      if (!state.currentFicha) return state
      const pages = [...state.currentFicha.pages] as Ficha['pages']
      const page = pages[state.currentPageIndex]
      pages[state.currentPageIndex] = {
        ...page,
        elements: [...page.elements, element],
      } as typeof page
      return {
        currentFicha: {
          ...state.currentFicha,
          pages,
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
        selectedElementId: element.id,
      }
    }),

  updateElement: (id, changes) =>
    set((state) => {
      if (!state.currentFicha) return state
      const pages = [...state.currentFicha.pages] as Ficha['pages']
      const page = pages[state.currentPageIndex]
      pages[state.currentPageIndex] = {
        ...page,
        elements: page.elements.map((el) =>
          el.id === id ? ({ ...el, ...changes } as CanvasElement) : el
        ),
      } as typeof page
      return {
        currentFicha: {
          ...state.currentFicha,
          pages,
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
      }
    }),

  removeElement: (id) =>
    set((state) => {
      if (!state.currentFicha) return state
      const pages = [...state.currentFicha.pages] as Ficha['pages']
      const page = pages[state.currentPageIndex]
      pages[state.currentPageIndex] = {
        ...page,
        elements: page.elements.filter((el) => el.id !== id),
      } as typeof page
      return {
        currentFicha: {
          ...state.currentFicha,
          pages,
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
        selectedElementId:
          state.selectedElementId === id ? null : state.selectedElementId,
      }
    }),

  reorderElement: (id, direction) =>
    set((state) => {
      if (!state.currentFicha) return state
      const pages = [...state.currentFicha.pages] as Ficha['pages']
      const page = pages[state.currentPageIndex]
      const elements = [...page.elements]
      const idx = elements.findIndex((el) => el.id === id)
      if (idx === -1) return state
      const targetIdx = direction === 'up' ? idx + 1 : idx - 1
      if (targetIdx < 0 || targetIdx >= elements.length) return state
      ;[elements[idx], elements[targetIdx]] = [elements[targetIdx], elements[idx]]
      // Sync zIndex to array order
      const reindexed = elements.map((el, i) => ({ ...el, zIndex: i }))
      pages[state.currentPageIndex] = {
        ...page,
        elements: reindexed,
      } as typeof page
      return {
        currentFicha: {
          ...state.currentFicha,
          pages,
          updatedAt: new Date().toISOString(),
        },
        isDirty: true,
      }
    }),
}))
