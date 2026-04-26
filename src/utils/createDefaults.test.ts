import { describe, it, expect } from 'vitest'
import { createDefaultFicha, createDefaultPage1, createDefaultPage2, createDefaultPage3 } from './createDefaults'

describe('createDefaults', () => {
  describe('createDefaultFicha()', () => {
    it('should return an object with .pages of length 3', () => {
      const ficha = createDefaultFicha()
      expect(ficha.pages).toHaveLength(3)
    })

    it('should have pages[0].type === "visual"', () => {
      const ficha = createDefaultFicha()
      expect(ficha.pages[0].type).toBe('visual')
    })

    it('should have pages[1].type === "graphic"', () => {
      const ficha = createDefaultFicha()
      expect(ficha.pages[1].type).toBe('graphic')
    })

    it('should have pages[2].type === "technical"', () => {
      const ficha = createDefaultFicha()
      expect(ficha.pages[2].type).toBe('technical')
    })

    it('should have a non-empty string id (UUID)', () => {
      const ficha = createDefaultFicha()
      expect(ficha.id).toBeTruthy()
      expect(typeof ficha.id).toBe('string')
      expect(ficha.id.length).toBeGreaterThan(0)
    })

    it('should produce different .id values on subsequent calls', () => {
      const ficha1 = createDefaultFicha()
      const ficha2 = createDefaultFicha()
      expect(ficha1.id).not.toBe(ficha2.id)
    })
  })

  describe('createDefaultPage2()', () => {
    it('should set pageTitle to the provided modelName', () => {
      const page = createDefaultPage2('TestModel')
      expect(page.pageTitle).toBe('TestModel')
    })

    it('should have default pageTitle when no modelName provided', () => {
      const page = createDefaultPage2()
      expect(page.pageTitle).toBe('')
    })
  })

  describe('createDefaultPage1()', () => {
    it('should return a Page1Visual with type "visual"', () => {
      const page = createDefaultPage1()
      expect(page.type).toBe('visual')
    })

    it('should have empty elements array', () => {
      const page = createDefaultPage1()
      expect(page.elements).toEqual([])
    })

    it('should have showAnnotations set to true', () => {
      const page = createDefaultPage1()
      expect(page.showAnnotations).toBe(true)
    })
  })

  describe('createDefaultPage3()', () => {
    it('should return a Page3Technical with type "technical"', () => {
      const page = createDefaultPage3()
      expect(page.type).toBe('technical')
    })

    it('should have empty elements array', () => {
      const page = createDefaultPage3()
      expect(page.elements).toEqual([])
    })

    it('should have empty patternPieces array', () => {
      const page = createDefaultPage3()
      expect(page.patternPieces).toEqual([])
    })

    it('should have garmentThumbnailData as undefined', () => {
      const page = createDefaultPage3()
      expect(page.garmentThumbnailData).toBeUndefined()
    })
  })
})
