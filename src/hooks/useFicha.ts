import { useEffect, useRef, useCallback } from 'react'
import { useFichaStore } from '@/store/fichaStore'
import { getFichaById, saveFicha } from '@/db/indexedDB'
import type { Ficha } from '@/types'
import { createDefaultPage4, createDefaultPage4Scaling } from '@/utils/createDefaults'

export function useFicha(id: string) {
  const { currentFicha, setCurrentFicha, markClean } = useFichaStore()
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load ficha on mount
  useEffect(() => {
    getFichaById(id).then((ficha) => {
      if (ficha) {
        const pages = ficha.pages as unknown as { type: string }[]
        // Migrate: add page 4 (phases) if missing — fichas created before page 4 existed
        if (pages.length === 3) {
          pages.push(createDefaultPage4())
        }
        // Migrate: insert scaling page at index 3, pushing phases to index 4
        if (pages.length === 4 && pages[3]?.type === 'phases') {
          pages.splice(3, 0, createDefaultPage4Scaling())
        }
        setCurrentFicha(ficha)
      }
    })
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [id, setCurrentFicha])

  // Auto-save: watches currentFicha directly (NOT isDirty — avoids infinite loop)
  const isFirstRender = useRef(true)
  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (!currentFicha) return
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    saveTimerRef.current = setTimeout(async () => {
      await saveFicha(currentFicha)
      markClean()
    }, 2000)
  }, [currentFicha, markClean])

  // Explicit save (also used by navigation away)
  const scheduleSave = useCallback(
    async (ficha?: Ficha) => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      const target = ficha ?? currentFicha
      if (!target) return
      await saveFicha(target)
      markClean()
    },
    [currentFicha, markClean]
  )

  return { currentFicha, scheduleSave }
}
