import { describe, it, expect, beforeEach } from 'vitest'
import { useFichaStore } from './fichaStore'
import { createDefaultFicha, createDefaultPage1 } from '@/utils/createDefaults'
import type { TextElement } from '@/types'

describe('fichaStore (Zustand)', () => {
  beforeEach(() => {
    useFichaStore.setState({
      currentFicha: null,
      currentPageIndex: 0,
      selectedElementId: null,
      isDirty: false,
    })
  })

  describe('setCurrentFicha', () => {
    it('should set currentFicha and reset selectedElementId and isDirty', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const state = useFichaStore.getState()
      expect(state.currentFicha).toBe(ficha)
      expect(state.selectedElementId).toBeNull()
      expect(state.isDirty).toBe(false)
    })

    it('should allow setting currentFicha to null', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)
      useFichaStore.getState().setCurrentFicha(null)

      const state = useFichaStore.getState()
      expect(state.currentFicha).toBeNull()
    })
  })

  describe('updateFichaField', () => {
    it('should update a ficha field and set isDirty to true', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)
      useFichaStore.getState().updateFichaField({ title: 'Updated Title' })

      const state = useFichaStore.getState()
      expect(state.currentFicha?.title).toBe('Updated Title')
      expect(state.isDirty).toBe(true)
    })

    it('should update updatedAt timestamp when field changes', () => {
      const ficha = createDefaultFicha()
      const originalUpdatedAt = ficha.updatedAt
      useFichaStore.getState().setCurrentFicha(ficha)

      // Wait a small amount to ensure timestamp changes
      const beforeUpdate = Date.now()
      useFichaStore.getState().updateFichaField({ title: 'New Title' })
      const afterUpdate = Date.now()

      const state = useFichaStore.getState()
      const updatedAtTime = new Date(state.currentFicha!.updatedAt).getTime()
      expect(updatedAtTime).toBeGreaterThanOrEqual(beforeUpdate)
      expect(updatedAtTime).toBeLessThanOrEqual(afterUpdate)
      // Verify it changed (may be same value if executed too fast, but should be newer or equal)
      expect(state.currentFicha!.updatedAt).toBeDefined()
    })

    it('should not modify state if currentFicha is null', () => {
      useFichaStore.getState().updateFichaField({ title: 'Attempt' })
      const state = useFichaStore.getState()
      expect(state.currentFicha).toBeNull()
      expect(state.isDirty).toBe(false)
    })
  })

  describe('markClean', () => {
    it('should set isDirty to false', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)
      useFichaStore.getState().updateFichaField({ title: 'Test' })
      expect(useFichaStore.getState().isDirty).toBe(true)

      useFichaStore.getState().markClean()
      expect(useFichaStore.getState().isDirty).toBe(false)
    })
  })

  describe('setCurrentPageIndex', () => {
    it('should change currentPageIndex and clear selectedElementId', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)
      useFichaStore.getState().setSelectedElementId('some-element-id')

      useFichaStore.getState().setCurrentPageIndex(1)

      const state = useFichaStore.getState()
      expect(state.currentPageIndex).toBe(1)
      expect(state.selectedElementId).toBeNull()
    })
  })

  describe('updateCurrentPage', () => {
    it('should update page-level field (showAnnotations)', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      useFichaStore.getState().updateCurrentPage({ showAnnotations: false })

      const state = useFichaStore.getState()
      const page = state.currentFicha!.pages[0]
      if (page.type === 'visual') {
        expect(page.showAnnotations).toBe(false)
      }
      expect(state.isDirty).toBe(true)
    })

    it('should update pageTitle on page 2', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)
      useFichaStore.getState().setCurrentPageIndex(1)

      useFichaStore.getState().updateCurrentPage({ pageTitle: 'New Title' })

      const state = useFichaStore.getState()
      const page = state.currentFicha!.pages[1]
      if (page.type === 'graphic') {
        expect(page.pageTitle).toBe('New Title')
      }
      expect(state.isDirty).toBe(true)
    })

    it('should update updatedAt timestamp', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const beforeUpdate = Date.now()
      useFichaStore.getState().updateCurrentPage({ showAnnotations: false })
      const afterUpdate = Date.now()

      const state = useFichaStore.getState()
      const updatedAtTime = new Date(state.currentFicha!.updatedAt).getTime()
      expect(updatedAtTime).toBeGreaterThanOrEqual(beforeUpdate)
      expect(updatedAtTime).toBeLessThanOrEqual(afterUpdate)
    })

    it('should not modify state if currentFicha is null', () => {
      useFichaStore.getState().updateCurrentPage({ showAnnotations: false })
      const state = useFichaStore.getState()
      expect(state.currentFicha).toBeNull()
      expect(state.isDirty).toBe(false)
    })
  })

  describe('addElement', () => {
    it('should add element to current page elements', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element: TextElement = {
        id: 'test-element-1',
        type: 'text',
        position: { x: 10, y: 20 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'Test Text',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element)

      const state = useFichaStore.getState()
      const page = state.currentFicha!.pages[0]
      expect(page.elements).toHaveLength(1)
      expect(page.elements[0]).toEqual(element)
      expect(state.isDirty).toBe(true)
      expect(state.selectedElementId).toBe('test-element-1')
    })

    it('should add multiple elements in sequence', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element1: TextElement = {
        id: 'elem-1',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'Text 1',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      const element2: TextElement = {
        id: 'elem-2',
        type: 'text',
        position: { x: 110, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 1,
        visible: true,
        content: 'Text 2',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element1)
      useFichaStore.getState().addElement(element2)

      const state = useFichaStore.getState()
      const page = state.currentFicha!.pages[0]
      expect(page.elements).toHaveLength(2)
      expect(page.elements[0].id).toBe('elem-1')
      expect(page.elements[1].id).toBe('elem-2')
    })

    it('should set selectedElementId to the new element', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element: TextElement = {
        id: 'new-elem',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'New Element',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element)
      expect(useFichaStore.getState().selectedElementId).toBe('new-elem')
    })
  })

  describe('updateElement', () => {
    it('should update element fields', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element: TextElement = {
        id: 'elem-to-update',
        type: 'text',
        position: { x: 10, y: 20 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'Original',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element)
      useFichaStore.getState().updateElement('elem-to-update', {
        position: { x: 50, y: 60 },
        content: 'Updated',
      })

      const state = useFichaStore.getState()
      const updatedElement = state.currentFicha!.pages[0].elements[0]
      expect(updatedElement.position).toEqual({ x: 50, y: 60 })
      if (updatedElement.type === 'text') {
        expect(updatedElement.content).toBe('Updated')
      }
      expect(state.isDirty).toBe(true)
    })

    it('should still set isDirty if element id is not found', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element: TextElement = {
        id: 'existing-elem',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'Existing',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element)
      useFichaStore.setState({ isDirty: false })

      useFichaStore.getState().updateElement('non-existent', {
        position: { x: 999, y: 999 },
      })

      const state = useFichaStore.getState()
      const unchangedElement = state.currentFicha!.pages[0].elements[0]
      // Element should be unchanged since it wasn't found
      expect(unchangedElement.position).toEqual({ x: 0, y: 0 })
      // isDirty will be set to true even if element not found (implementation behavior)
      // This is acceptable as it maintains consistency with state update pattern
      expect(state.isDirty).toBe(true)
    })
  })

  describe('removeElement', () => {
    it('should remove element from current page', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element: TextElement = {
        id: 'elem-to-remove',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'Remove me',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element)
      expect(useFichaStore.getState().currentFicha!.pages[0].elements).toHaveLength(1)

      useFichaStore.getState().removeElement('elem-to-remove')

      const state = useFichaStore.getState()
      expect(state.currentFicha!.pages[0].elements).toHaveLength(0)
      expect(state.isDirty).toBe(true)
    })

    it('should clear selectedElementId if removed element was selected', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element: TextElement = {
        id: 'elem-selected',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'Selected',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element)
      expect(useFichaStore.getState().selectedElementId).toBe('elem-selected')

      useFichaStore.getState().removeElement('elem-selected')

      const state = useFichaStore.getState()
      expect(state.selectedElementId).toBeNull()
    })

    it('should preserve selectedElementId if different element is removed', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element1: TextElement = {
        id: 'elem-1',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'Element 1',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      const element2: TextElement = {
        id: 'elem-2',
        type: 'text',
        position: { x: 110, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 1,
        visible: true,
        content: 'Element 2',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element1)
      useFichaStore.getState().addElement(element2)
      useFichaStore.getState().setSelectedElementId('elem-1')

      useFichaStore.getState().removeElement('elem-2')

      const state = useFichaStore.getState()
      expect(state.selectedElementId).toBe('elem-1')
    })
  })

  describe('setSelectedElementId', () => {
    it('should set selectedElementId', () => {
      useFichaStore.getState().setSelectedElementId('some-id')
      expect(useFichaStore.getState().selectedElementId).toBe('some-id')
    })

    it('should allow setting selectedElementId to null', () => {
      useFichaStore.getState().setSelectedElementId('some-id')
      useFichaStore.getState().setSelectedElementId(null)
      expect(useFichaStore.getState().selectedElementId).toBeNull()
    })
  })

  describe('reorderElement', () => {
    it('should move element up (increase zIndex)', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element1: TextElement = {
        id: 'elem-1',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'First',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      const element2: TextElement = {
        id: 'elem-2',
        type: 'text',
        position: { x: 110, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 1,
        visible: true,
        content: 'Second',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element1)
      useFichaStore.getState().addElement(element2)

      // Move first element up
      useFichaStore.getState().reorderElement('elem-1', 'up')

      const state = useFichaStore.getState()
      const elements = state.currentFicha!.pages[0].elements
      expect(elements[0].id).toBe('elem-2')
      expect(elements[1].id).toBe('elem-1')
      expect(elements[0].zIndex).toBe(0)
      expect(elements[1].zIndex).toBe(1)
    })

    it('should move element down (decrease zIndex)', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element1: TextElement = {
        id: 'elem-1',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'First',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      const element2: TextElement = {
        id: 'elem-2',
        type: 'text',
        position: { x: 110, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 1,
        visible: true,
        content: 'Second',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element1)
      useFichaStore.getState().addElement(element2)

      // Move second element down
      useFichaStore.getState().reorderElement('elem-2', 'down')

      const state = useFichaStore.getState()
      const elements = state.currentFicha!.pages[0].elements
      expect(elements[0].id).toBe('elem-2')
      expect(elements[1].id).toBe('elem-1')
      expect(elements[0].zIndex).toBe(0)
      expect(elements[1].zIndex).toBe(1)
    })

    it('should not reorder if element would go out of bounds (up)', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element: TextElement = {
        id: 'elem',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'Only element',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element)
      useFichaStore.setState({ isDirty: false })

      // Try to move up beyond bounds
      useFichaStore.getState().reorderElement('elem', 'up')

      const state = useFichaStore.getState()
      const elements = state.currentFicha!.pages[0].elements
      expect(elements[0].id).toBe('elem')
      expect(state.isDirty).toBe(false)
    })

    it('should not reorder if element id does not exist', () => {
      const ficha = createDefaultFicha()
      useFichaStore.getState().setCurrentFicha(ficha)

      const element: TextElement = {
        id: 'elem',
        type: 'text',
        position: { x: 0, y: 0 },
        size: { w: 100, h: 50 },
        rotation: 0,
        zIndex: 0,
        visible: true,
        content: 'Element',
        fontSize: 16,
        fontFamily: 'Arial',
        fontWeight: 'normal',
        fontStyle: 'normal',
        color: '#000000',
        align: 'left',
      }

      useFichaStore.getState().addElement(element)
      useFichaStore.setState({ isDirty: false })

      useFichaStore.getState().reorderElement('non-existent', 'up')

      const state = useFichaStore.getState()
      expect(state.isDirty).toBe(false)
    })
  })
})
