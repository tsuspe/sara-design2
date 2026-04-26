import { Eye, ChevronLeft } from 'lucide-react'
import { useFichaStore } from '@/store/fichaStore'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface EditorHeaderProps {
  onBack: () => void
}

export default function EditorHeader({ onBack }: EditorHeaderProps) {
  const { currentFicha, updateFichaField, isDirty } = useFichaStore()

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    updateFichaField({ title: e.target.value })
  }

  const handlePreview = () => {
    console.log('Vista previa (placeholder)')
  }

  return (
    <header className="h-14 bg-white shadow-sm flex items-center px-4 gap-4 flex-shrink-0">
      {/* Left: back button */}
      <Button variant="ghost" size="icon" onClick={onBack} aria-label="Volver al inicio">
        <ChevronLeft className="size-5" />
      </Button>

      {/* Center: editable title */}
      <div className="flex-1 flex justify-center">
        <Input
          className="max-w-xs text-center font-medium"
          value={currentFicha?.title ?? ''}
          onChange={handleTitleChange}
          placeholder="Sin título"
        />
      </div>

      {/* Right: preview button + save indicator */}
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="sm" onClick={handlePreview} className="gap-1.5">
          <Eye className="size-4" />
          Vista previa
        </Button>

        {/* Save indicator dot */}
        <span
          title={isDirty ? 'Cambios sin guardar' : 'Guardado'}
          className={`size-2.5 rounded-full transition-colors ${
            isDirty ? 'bg-gray-400' : 'bg-green-500'
          }`}
        />
      </div>
    </header>
  )
}
