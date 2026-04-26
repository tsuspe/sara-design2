import { useState } from 'react'
import type { Ficha } from '@/types'
import { createDefaultFicha } from '@/utils/createDefaults'
import { saveFicha } from '@/db/indexedDB'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface NewFichaModalProps {
  open: boolean
  onClose: () => void
  onCreate: (ficha: Ficha) => void
}

export default function NewFichaModal({ open, onClose, onCreate }: NewFichaModalProps) {
  const [title, setTitle] = useState('')
  const [modelName, setModelName] = useState('')
  const [fichaNumber, setFichaNumber] = useState('')
  const [saving, setSaving] = useState(false)

  function handleClose() {
    setTitle('')
    setModelName('')
    setFichaNumber('')
    onClose()
  }

  async function handleCreate() {
    if (!title.trim()) return
    setSaving(true)
    try {
      const ficha = createDefaultFicha()
      ficha.title = title.trim()
      ficha.modelName = modelName.trim()
      ficha.fichaNumber = fichaNumber.trim()
      // Page2Graphic pageTitle defaults to modelName
      ficha.pages[1].pageTitle = modelName.trim()
      await saveFicha(ficha)
      onCreate(ficha)
      setTitle('')
      setModelName('')
      setFichaNumber('')
    } finally {
      setSaving(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => { if (!isOpen) handleClose() }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva ficha</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nfm-title">Título *</Label>
            <Input
              id="nfm-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ej. Camiseta básica"
              autoFocus
              onKeyDown={(e) => { if (e.key === 'Enter' && title.trim()) handleCreate() }}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nfm-model">Modelo</Label>
            <Input
              id="nfm-model"
              value={modelName}
              onChange={(e) => setModelName(e.target.value)}
              placeholder="Ej. Verano 2025"
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="nfm-number">Número de ficha</Label>
            <Input
              id="nfm-number"
              value={fichaNumber}
              onChange={(e) => setFichaNumber(e.target.value)}
              placeholder="Ej. 001"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="ghost" onClick={handleClose} disabled={saving}>
            Cancelar
          </Button>
          <Button onClick={handleCreate} disabled={!title.trim() || saving}>
            {saving ? 'Creando...' : 'Crear'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
