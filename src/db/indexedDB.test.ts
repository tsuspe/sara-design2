import 'fake-indexeddb/auto'
import { describe, it, expect, beforeEach } from 'vitest'
import type { Ficha } from '@/types'
import { db, getAllFichas, getFichaById, saveFicha, deleteFicha, updateFicha } from './indexedDB'

describe('IndexedDB Database Layer', () => {
  beforeEach(async () => {
    await db.fichas.clear()
  })

  it('saveFicha then getFichaById returns the saved ficha', async () => {
    const ficha: Ficha = {
      id: 'test-1',
      fichaNumber: 'F-001',
      title: 'Test Ficha',
      modelName: 'Test Model',
      printTechnique: 'Screen Print',
      gsm: '200',
      emissionDate: '2026-04-26',
      receptionDate: '2026-04-26',
      tallerName: 'Test Taller',
      approvedPrototype: null,
      modifications: 'None',
      designerName: '',
      brand: '',
      season: '', fabric: '', size: '', description: '', article: '', line: '',
      pages: [
        {
          type: 'visual',
          elements: [],
          showAnnotations: true,
        },
        {
          type: 'graphic',
          elements: [],
          pageTitle: 'Test Model',
          colorPalette: [],
        },
        {
          type: 'technical',
          elements: [],
          patternPieces: [],
          measurements: [],
        },
      ],
      createdAt: '2026-04-26T00:00:00.000Z',
      updatedAt: '2026-04-26T00:00:00.000Z',
    }

    await saveFicha(ficha)
    const retrieved = await getFichaById('test-1')

    expect(retrieved).toEqual(ficha)
  })

  it('getAllFichas returns fichas sorted newest-updated first', async () => {
    const ficha1: Ficha = {
      id: 'test-1',
      fichaNumber: 'F-001',
      title: 'Ficha 1',
      modelName: 'Model 1',
      printTechnique: 'Screen Print',
      gsm: '200',
      emissionDate: '2026-04-26',
      receptionDate: '2026-04-26',
      tallerName: 'Taller 1',
      approvedPrototype: null,
      modifications: '',
      designerName: '',
      brand: '',
      season: '', fabric: '', size: '', description: '', article: '', line: '',
      pages: [
        { type: 'visual', elements: [], showAnnotations: true },
        { type: 'graphic', elements: [], pageTitle: 'Model 1', colorPalette: [] },
        { type: 'technical', elements: [], patternPieces: [], measurements: [] },
      ],
      createdAt: '2026-04-26T10:00:00.000Z',
      updatedAt: '2026-04-26T10:00:00.000Z',
    }

    const ficha2: Ficha = {
      id: 'test-2',
      fichaNumber: 'F-002',
      title: 'Ficha 2',
      modelName: 'Model 2',
      printTechnique: 'Digital Print',
      gsm: '220',
      emissionDate: '2026-04-26',
      receptionDate: '2026-04-26',
      tallerName: 'Taller 2',
      approvedPrototype: null,
      modifications: '',
      designerName: '',
      brand: '',
      season: '', fabric: '', size: '', description: '', article: '', line: '',
      pages: [
        { type: 'visual', elements: [], showAnnotations: true },
        { type: 'graphic', elements: [], pageTitle: 'Model 2', colorPalette: [] },
        { type: 'technical', elements: [], patternPieces: [], measurements: [] },
      ],
      createdAt: '2026-04-26T11:00:00.000Z',
      updatedAt: '2026-04-26T11:00:00.000Z',
    }

    await saveFicha(ficha1)
    await saveFicha(ficha2)

    const all = await getAllFichas()

    expect(all).toHaveLength(2)
    expect(all[0].id).toBe('test-2')
    expect(all[1].id).toBe('test-1')
  })

  it('deleteFicha removes the ficha', async () => {
    const ficha: Ficha = {
      id: 'test-1',
      fichaNumber: 'F-001',
      title: 'Test Ficha',
      modelName: 'Test Model',
      printTechnique: 'Screen Print',
      gsm: '200',
      emissionDate: '2026-04-26',
      receptionDate: '2026-04-26',
      tallerName: 'Test Taller',
      approvedPrototype: null,
      modifications: '',
      designerName: '',
      brand: '',
      season: '', fabric: '', size: '', description: '', article: '', line: '',
      pages: [
        { type: 'visual', elements: [], showAnnotations: true },
        { type: 'graphic', elements: [], pageTitle: 'Test Model', colorPalette: [] },
        { type: 'technical', elements: [], patternPieces: [], measurements: [] },
      ],
      createdAt: '2026-04-26T00:00:00.000Z',
      updatedAt: '2026-04-26T00:00:00.000Z',
    }

    await saveFicha(ficha)
    await deleteFicha('test-1')

    const retrieved = await getFichaById('test-1')

    expect(retrieved).toBeUndefined()
  })

  it('updateFicha merges changes and updates updatedAt', async () => {
    const ficha: Ficha = {
      id: 'test-1',
      fichaNumber: 'F-001',
      title: 'Test Ficha',
      modelName: 'Test Model',
      printTechnique: 'Screen Print',
      gsm: '200',
      emissionDate: '2026-04-26',
      receptionDate: '2026-04-26',
      tallerName: 'Test Taller',
      approvedPrototype: null,
      modifications: '',
      designerName: '',
      brand: '',
      season: '', fabric: '', size: '', description: '', article: '', line: '',
      pages: [
        { type: 'visual', elements: [], showAnnotations: true },
        { type: 'graphic', elements: [], pageTitle: 'Test Model', colorPalette: [] },
        { type: 'technical', elements: [], patternPieces: [], measurements: [] },
      ],
      createdAt: '2026-04-26T00:00:00.000Z',
      updatedAt: '2026-04-26T00:00:00.000Z',
    }

    await saveFicha(ficha)

    const oldUpdatedAt = ficha.updatedAt
    await updateFicha('test-1', { title: 'Updated Title', approvedPrototype: true })

    const updated = await getFichaById('test-1')

    expect(updated).toBeDefined()
    expect(updated!.title).toBe('Updated Title')
    expect(updated!.approvedPrototype).toBe(true)
    expect(updated!.fichaNumber).toBe('F-001')
    expect(updated!.updatedAt).not.toBe(oldUpdatedAt)
  })
})
