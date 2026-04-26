import { useRef } from 'react'
import { Image, FileText, Type, Tag, ArrowRight, Square, ChevronUp, ChevronDown, Trash2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useFichaStore } from '@/store/fichaStore'
import { useCanvas } from '@/hooks/useCanvas'
import { fileToDataUrl, resizeImage } from '@/utils/imageUtils'
import { pdfFirstPageToDataUrl } from '@/utils/pdfToImage'

export default function Toolbar() {
  const imageInputRef = useRef<HTMLInputElement>(null)
  const pdfInputRef = useRef<HTMLInputElement>(null)
  const { currentPageIndex, updateCurrentPage } = useFichaStore()
  const { currentPage, selectedElementId, createElement, addElement, removeElement, reorderElement } = useCanvas()

  const handleImageFile = async (file: File) => {
    const dataUrl = await fileToDataUrl(file)
    const resized = await resizeImage(dataUrl, 600, 800)
    const element = createElement('image', { src: resized })
    addElement(element)
  }

  const handlePdfFile = async (file: File) => {
    const dataUrl = await pdfFirstPageToDataUrl(file)
    const resized = await resizeImage(dataUrl, 600, 800)
    const element = createElement('image', { src: resized })
    addElement(element)
  }

  const page1 = currentPageIndex === 0 ? currentPage : null

  return (
    <div className="w-64 bg-white border-r flex-shrink-0 flex flex-col overflow-y-auto">
      <div className="p-3 border-b">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Añadir elemento</p>
        <div className="flex flex-col gap-1">
          {/* Hidden file inputs */}
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handleImageFile(f)
              e.target.value = ''
            }}
          />
          <input
            ref={pdfInputRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) handlePdfFile(f)
              e.target.value = ''
            }}
          />

          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={() => imageInputRef.current?.click()}
          >
            <Image className="w-4 h-4" /> Imagen
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={() => pdfInputRef.current?.click()}
          >
            <FileText className="w-4 h-4" /> PDF → Imagen
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={() => addElement(createElement('text'))}
          >
            <Type className="w-4 h-4" /> Texto
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={() => addElement(createElement('label'))}
          >
            <Tag className="w-4 h-4" /> Etiqueta
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={() => addElement(createElement('arrow'))}
          >
            <ArrowRight className="w-4 h-4" /> Flecha
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="justify-start gap-2"
            onClick={() => addElement(createElement('shape'))}
          >
            <Square className="w-4 h-4" /> Forma
          </Button>
        </div>
      </div>

      {/* Annotations toggle — only for page 1 */}
      {page1 && page1.type === 'visual' && (
        <div className="p-3 border-b">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Vista</p>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={page1.showAnnotations}
              onChange={() => updateCurrentPage({ showAnnotations: !page1.showAnnotations })}
              className="rounded"
            />
            <span className="text-sm">Mostrar anotaciones</span>
          </label>
        </div>
      )}

      {/* Element layer controls — only when element selected */}
      {selectedElementId && (
        <div className="p-3 border-b">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">Capa</p>
          <div className="flex flex-col gap-1">
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={() => reorderElement(selectedElementId, 'up')}
            >
              <ChevronUp className="w-4 h-4" /> Subir capa
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="justify-start gap-2"
              onClick={() => reorderElement(selectedElementId, 'down')}
            >
              <ChevronDown className="w-4 h-4" /> Bajar capa
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="justify-start gap-2"
              onClick={() => removeElement(selectedElementId)}
            >
              <Trash2 className="w-4 h-4" /> Eliminar
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
