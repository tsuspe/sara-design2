import { useEffect, useRef, useCallback } from 'react'
import { useFichaStore } from '@/store/fichaStore'
import { getFichaById, saveFicha } from '@/db/indexedDB'
import type { Ficha } from '@/types'

export function useFicha(id: string) {
  const { currentFicha, setCurrentFicha, markClean } = useFichaStore()
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Load ficha on mount
  useEffect(() => {
    getFichaById(id).then((ficha) => {
      if (ficha) setCurrentFicha(ficha)
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
