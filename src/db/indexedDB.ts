import Dexie, { type Table } from 'dexie'
import type { Ficha } from '@/types'

export class SaraDB extends Dexie {
  fichas!: Table<Ficha>

  constructor() {
    super('sara-design2')
    this.version(1).stores({
      fichas: 'id, updatedAt, title',
    })
  }
}

export const db = new SaraDB()

// ─── CRUD helpers ─────────────────────────────────────────────────────────────

export async function getAllFichas(): Promise<Ficha[]> {
  return db.fichas.orderBy('updatedAt').reverse().toArray()
}

export async function getFichaById(id: string): Promise<Ficha | undefined> {
  return db.fichas.get(id)
}

export async function saveFicha(ficha: Ficha): Promise<void> {
  await db.fichas.put(ficha)
}

export async function deleteFicha(id: string): Promise<void> {
  await db.fichas.delete(id)
}

export async function updateFicha(id: string, changes: Partial<Ficha>): Promise<void> {
  await db.fichas.update(id, { ...changes, updatedAt: new Date().toISOString() })
}
