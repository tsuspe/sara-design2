import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Ficha } from '@/types'
import { getAllFichas, deleteFicha, saveFicha } from '@/db/indexedDB'
import FichaCard from '@/components/FichaCard'
import NewFichaModal from '@/components/NewFichaModal'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import { generateFichaThumbnailDataUrl } from '@/utils/thumbnail'

export default function Dashboard() {
  const navigate = useNavigate()
  const [fichas, setFichas] = useState<Ficha[]>([])
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const generatedRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    getAllFichas()
      .then(setFichas)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (loading) return
    const missing = fichas.filter((ficha) => !ficha.thumbnailData && !generatedRef.current.has(ficha.id))
    if (missing.length === 0) return

    let cancelled = false
    const timer = window.setTimeout(async () => {
      for (const ficha of missing) {
        if (cancelled) return
        generatedRef.current.add(ficha.id)
        try {
          const thumbnailData = generateFichaThumbnailDataUrl(ficha)
          const updated = { ...ficha, thumbnailData }
          await saveFicha(updated)
          setFichas((prev) =>
            prev.map((item) => (item.id === ficha.id ? { ...item, thumbnailData } : item))
          )
        } catch (err) {
          console.warn('Dashboard thumbnail generation skipped:', err)
        }
      }
    }, 100)

    return () => {
      cancelled = true
      window.clearTimeout(timer)
    }
  }, [fichas, loading])

  function handleOpen(id: string) {
    navigate(`/editor/${id}`)
  }

  async function handleDelete(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    await deleteFicha(id)
    setFichas((prev) => prev.filter((f) => f.id !== id))
  }

  function handleCreated(ficha: Ficha) {
    setModalOpen(false)
    navigate(`/editor/${ficha.id}`)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-semibold text-gray-900">Fichas de diseño</h1>
        <Button onClick={() => setModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Nueva ficha
        </Button>
      </header>

      {/* Content */}
      <main className="p-6">
        {loading ? (
          <div className="flex items-center justify-center py-24 text-gray-400">
            Cargando...
          </div>
        ) : fichas.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
            <p className="text-gray-500 text-base">
              No hay fichas aún. Crea tu primera ficha.
            </p>
            <Button variant="outline" onClick={() => setModalOpen(true)} className="gap-2">
              <Plus className="h-4 w-4" />
              Nueva ficha
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fichas.map((ficha) => (
              <FichaCard
                key={ficha.id}
                ficha={ficha}
                onOpen={() => handleOpen(ficha.id)}
                onDelete={(e) => handleDelete(e, ficha.id)}
              />
            ))}
          </div>
        )}
      </main>

      <NewFichaModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={handleCreated}
      />
    </div>
  )
}
