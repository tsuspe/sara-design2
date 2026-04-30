import { useFichaStore } from '@/store/fichaStore'
import { v4 as uuidv4 } from 'uuid'
import type {
  CanvasElement,
  CustomFont,
  Ficha,
  FichaPage,
  ImageElement,
  TextElement,
  LabelElement,
  ArrowElement,
  ShapeElement,
  PatternPiece,
  Measurement,
} from '@/types'
import PatternPiecesPanel from '@/components/editor/PatternPiecesPanel'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Slider } from '@/components/ui/slider'

const FONT_OPTIONS = [
  { label: 'Arial', value: 'Arial, sans-serif' },
  { label: 'Helvetica', value: 'Helvetica, Arial, sans-serif' },
  { label: 'Geist', value: 'Geist, Arial, sans-serif' },
  { label: 'Times', value: '"Times New Roman", serif' },
  { label: 'Georgia', value: 'Georgia, serif' },
  { label: 'Garamond', value: 'Garamond, Georgia, serif' },
  { label: 'Verdana', value: 'Verdana, sans-serif' },
  { label: 'Courier', value: '"Courier New", monospace' },
  { label: 'Impact', value: 'Impact, sans-serif' },
]

function fontFormatFromName(name: string): CustomFont['format'] {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'otf') return 'opentype'
  if (ext === 'woff') return 'woff'
  if (ext === 'woff2') return 'woff2'
  return 'truetype'
}

function fileToDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

function FontSelect({
  value,
  onChange,
}: {
  value: string
  onChange: (value: string) => void
}) {
  const customFonts = useFichaStore((state) => state.currentFicha?.customFonts ?? [])
  const allOptions = [
    ...FONT_OPTIONS,
    ...customFonts.map((font) => ({ label: font.name, value: `"${font.family}", sans-serif` })),
  ]

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 text-sm border rounded px-2 bg-white"
    >
      {allOptions.map((font) => (
        <option key={font.value} value={font.value}>
          {font.label}
        </option>
      ))}
    </select>
  )
}

// ─── Ficha Metadata Form ──────────────────────────────────────────────────────

interface FichaMetadataFormProps {
  ficha: Ficha
  onUpdate: (changes: Partial<Omit<Ficha, 'pages'>>) => void
}

function FichaMetadataForm({ ficha, onUpdate }: FichaMetadataFormProps) {
  const approvedValue =
    ficha.approvedPrototype === null
      ? 'null'
      : ficha.approvedPrototype
        ? 'true'
        : 'false'

  const handleApprovedChange = (value: string) => {
    const mapped =
      value === 'null' ? null : value === 'true' ? true : false
    onUpdate({ approvedPrototype: mapped })
  }

  const handleFontUpload = async (file: File) => {
    const dataUrl = await fileToDataUrl(file)
    const name = file.name.replace(/\.(ttf|otf|woff2?|TTF|OTF|WOFF2?)$/, '')
    const font: CustomFont = {
      id: uuidv4(),
      name,
      family: `SaraCustom-${uuidv4()}`,
      dataUrl,
      format: fontFormatFromName(file.name),
    }
    onUpdate({ customFonts: [...(ficha.customFonts ?? []), font] })
  }

  const handleRemoveFont = (id: string) => {
    onUpdate({ customFonts: (ficha.customFonts ?? []).filter((font) => font.id !== id) })
  }

  return (
    <div className="flex flex-col gap-3 p-3 overflow-y-auto">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Datos de la ficha
      </p>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Diseñadora</Label>
        <Input
          value={ficha.designerName}
          onChange={(e) => onUpdate({ designerName: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Marca</Label>
        <Input
          value={ficha.brand}
          onChange={(e) => onUpdate({ brand: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Nº Ficha</Label>
        <Input
          value={ficha.fichaNumber}
          onChange={(e) => onUpdate({ fichaNumber: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Título</Label>
        <Input
          value={ficha.title}
          onChange={(e) => onUpdate({ title: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Modelo</Label>
        <Input
          value={ficha.modelName}
          onChange={(e) => onUpdate({ modelName: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Fecha emisión</Label>
        <Input
          type="date"
          value={ficha.emissionDate}
          onChange={(e) => onUpdate({ emissionDate: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Fecha recepción</Label>
        <Input
          type="date"
          value={ficha.receptionDate}
          onChange={(e) => onUpdate({ receptionDate: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Prototipo aprobado</Label>
        <select
          value={approvedValue}
          onChange={(e) => handleApprovedChange(e.target.value)}
          className="h-7 text-sm border rounded px-2 bg-white"
        >
          <option value="null">Pendiente</option>
          <option value="true">Aprobado</option>
          <option value="false">Rechazado</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Temporada / Season</Label>
        <Input
          value={ficha.season}
          onChange={(e) => onUpdate({ season: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Talla Base</Label>
        <Input
          value={ficha.size}
          onChange={(e) => onUpdate({ size: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Artículo / Código</Label>
        <Input
          value={ficha.article}
          onChange={(e) => onUpdate({ article: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Línea / Colección</Label>
        <Input
          value={ficha.line}
          onChange={(e) => onUpdate({ line: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Descripción</Label>
        <textarea
          value={ficha.description}
          onChange={(e) => onUpdate({ description: e.target.value })}
          rows={2}
          className="text-sm border rounded px-2 py-1 resize-none"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Modificaciones</Label>
        <textarea
          value={ficha.modifications}
          onChange={(e) => onUpdate({ modifications: e.target.value })}
          rows={3}
          className="text-sm border rounded px-2 py-1 resize-none"
        />
      </div>

      <hr />

      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Tipografía de plantilla
      </p>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Fuente títulos</Label>
        <FontSelect
          value={ficha.titleFontFamily ?? 'Arial, sans-serif'}
          onChange={(titleFontFamily) => onUpdate({ titleFontFamily })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <Label className="text-xs">Tipografías personalizadas</Label>
        <Input
          type="file"
          accept=".ttf,.otf,.woff,.woff2,font/ttf,font/otf,font/woff,font/woff2"
          onChange={(e) => {
            const file = e.target.files?.[0]
            if (file) void handleFontUpload(file)
            e.target.value = ''
          }}
          className="h-8 text-xs"
        />
        {(ficha.customFonts ?? []).length > 0 && (
          <div className="flex flex-col gap-1">
            {(ficha.customFonts ?? []).map((font) => (
              <div key={font.id} className="flex items-center justify-between gap-2 rounded border px-2 py-1">
                <span className="text-xs truncate" style={{ fontFamily: `"${font.family}", sans-serif` }}>
                  {font.name}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveFont(font.id)}
                  className="text-xs text-red-500 hover:text-red-700"
                >
                  Quitar
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Tamaño título</Label>
          <Input
            type="number"
            min={12}
            max={48}
            value={ficha.titleFontSize ?? 24}
            onChange={(e) => onUpdate({ titleFontSize: Number(e.target.value) })}
            className="h-7 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Fuente datos</Label>
          <FontSelect
            value={ficha.bodyFontFamily ?? 'Arial, sans-serif'}
            onChange={(bodyFontFamily) => onUpdate({ bodyFontFamily })}
          />
        </div>
      </div>

      <div className="flex gap-3">
        <label className="flex items-center gap-1 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={(ficha.titleFontWeight ?? 'bold') === 'bold'}
            onChange={(e) => onUpdate({ titleFontWeight: e.target.checked ? 'bold' : 'normal' })}
            className="rounded"
          />
          Título negrita
        </label>
        <label className="flex items-center gap-1 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={(ficha.titleFontStyle ?? 'normal') === 'italic'}
            onChange={(e) => onUpdate({ titleFontStyle: e.target.checked ? 'italic' : 'normal' })}
            className="rounded"
          />
          Título cursiva
        </label>
      </div>
    </div>
  )
}

// ─── Common Position / Size / Rotation / Visible ─────────────────────────────

interface CommonPropsProps {
  element: CanvasElement
  onUpdate: (changes: Partial<CanvasElement>) => void
}

function CommonProps({ element, onUpdate }: CommonPropsProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">X</Label>
          <Input
            type="number"
            value={element.position.x}
            onChange={(e) =>
              onUpdate({ position: { ...element.position, x: Number(e.target.value) } } as Partial<CanvasElement>)
            }
            className="h-7 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">Y</Label>
          <Input
            type="number"
            value={element.position.y}
            onChange={(e) =>
              onUpdate({ position: { ...element.position, y: Number(e.target.value) } } as Partial<CanvasElement>)
            }
            className="h-7 text-sm"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <div className="flex flex-col gap-1">
          <Label className="text-xs">W</Label>
          <Input
            type="number"
            value={element.size.w}
            onChange={(e) =>
              onUpdate({ size: { ...element.size, w: Number(e.target.value) } } as Partial<CanvasElement>)
            }
            className="h-7 text-sm"
          />
        </div>
        <div className="flex flex-col gap-1">
          <Label className="text-xs">H</Label>
          <Input
            type="number"
            value={element.size.h}
            onChange={(e) =>
              onUpdate({ size: { ...element.size, h: Number(e.target.value) } } as Partial<CanvasElement>)
            }
            className="h-7 text-sm"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Rotación</Label>
        <Input
          type="number"
          min={0}
          max={360}
          value={element.rotation}
          onChange={(e) => onUpdate({ rotation: Number(e.target.value) } as Partial<CanvasElement>)}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="visible-check"
          checked={element.visible}
          onChange={(e) => onUpdate({ visible: e.target.checked } as Partial<CanvasElement>)}
          className="rounded"
        />
        <Label htmlFor="visible-check" className="text-xs cursor-pointer">
          Visible
        </Label>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs text-gray-400">Z-index: {element.zIndex}</Label>
      </div>
    </>
  )
}

// ─── Element-specific Properties ──────────────────────────────────────────────

function ImageProps({ element, onUpdate }: { element: ImageElement; onUpdate: (c: Partial<ImageElement>) => void }) {
  return (
    <div className="flex flex-col gap-1">
      <Label className="text-xs">Opacidad ({Math.round(element.opacity * 100)}%)</Label>
      <Slider
        min={0}
        max={1}
        step={0.01}
        value={[element.opacity]}
        onValueChange={(vals) => onUpdate({ opacity: Array.isArray(vals) ? (vals as number[])[0] : (vals as number) })}
      />
    </div>
  )
}

function TextProps({ element, onUpdate }: { element: TextElement; onUpdate: (c: Partial<TextElement>) => void }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Fuente</Label>
        <FontSelect
          value={element.fontFamily}
          onChange={(fontFamily) => onUpdate({ fontFamily })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Tamaño de fuente</Label>
        <Input
          type="number"
          min={6}
          max={200}
          value={element.fontSize}
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex gap-3">
        <label className="flex items-center gap-1 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={element.fontWeight === 'bold'}
            onChange={(e) => onUpdate({ fontWeight: e.target.checked ? 'bold' : 'normal' })}
            className="rounded"
          />
          Negrita
        </label>
        <label className="flex items-center gap-1 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={element.fontStyle === 'italic'}
            onChange={(e) => onUpdate({ fontStyle: e.target.checked ? 'italic' : 'normal' })}
            className="rounded"
          />
          Cursiva
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Color</Label>
        <input
          type="color"
          value={element.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Alineación</Label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              onClick={() => onUpdate({ align })}
              className={`flex-1 py-1 text-xs border rounded ${element.align === align ? 'bg-gray-200 font-semibold' : 'bg-white'}`}
            >
              {align === 'left' ? 'Izq' : align === 'center' ? 'Cen' : 'Der'}
            </button>
          ))}
        </div>
      </div>
    </>
  )
}

function LabelProps({ element, onUpdate }: { element: LabelElement; onUpdate: (c: Partial<LabelElement>) => void }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Contenido</Label>
        <Input
          value={element.content}
          onChange={(e) => onUpdate({ content: e.target.value })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Fuente</Label>
        <FontSelect
          value={element.fontFamily ?? 'Arial, sans-serif'}
          onChange={(fontFamily) => onUpdate({ fontFamily })}
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Tamaño de fuente</Label>
        <Input
          type="number"
          min={6}
          max={200}
          value={element.fontSize}
          onChange={(e) => onUpdate({ fontSize: Number(e.target.value) })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex gap-3">
        <label className="flex items-center gap-1 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={(element.fontWeight ?? 'normal') === 'bold'}
            onChange={(e) => onUpdate({ fontWeight: e.target.checked ? 'bold' : 'normal' })}
            className="rounded"
          />
          Negrita
        </label>
        <label className="flex items-center gap-1 cursor-pointer text-sm">
          <input
            type="checkbox"
            checked={(element.fontStyle ?? 'normal') === 'italic'}
            onChange={(e) => onUpdate({ fontStyle: e.target.checked ? 'italic' : 'normal' })}
            className="rounded"
          />
          Cursiva
        </label>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Alineación</Label>
        <div className="flex gap-1">
          {(['left', 'center', 'right'] as const).map((align) => (
            <button
              key={align}
              onClick={() => onUpdate({ align })}
              className={`flex-1 py-1 text-xs border rounded ${(element.align ?? 'left') === align ? 'bg-gray-200 font-semibold' : 'bg-white'}`}
            >
              {align === 'left' ? 'Izq' : align === 'center' ? 'Cen' : 'Der'}
            </button>
          ))}
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Color texto</Label>
        <input
          type="color"
          value={element.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Color fondo</Label>
        <input
          type="color"
          value={element.backgroundColor}
          onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border"
        />
      </div>
    </>
  )
}

function ArrowProps({ element, onUpdate }: { element: ArrowElement; onUpdate: (c: Partial<ArrowElement>) => void }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Tipo de flecha</Label>
        <select
          value={element.variant ?? 'straight'}
          onChange={(e) => onUpdate({ variant: e.target.value as ArrowElement['variant'] })}
          className="h-7 text-sm border rounded px-2 bg-white"
        >
          <option value="straight">Recta</option>
          <option value="curved">Curva</option>
          <option value="elbow">90 grados</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Color</Label>
        <input
          type="color"
          value={element.color}
          onChange={(e) => onUpdate({ color: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Grosor de trazo</Label>
        <Input
          type="number"
          min={1}
          max={10}
          value={element.strokeWidth}
          onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
          className="h-7 text-sm"
        />
      </div>
    </>
  )
}

function ShapeProps({ element, onUpdate }: { element: ShapeElement; onUpdate: (c: Partial<ShapeElement>) => void }) {
  return (
    <>
      <div className="flex flex-col gap-1">
        <Label className="text-xs">Forma</Label>
        <select
          value={element.shape}
          onChange={(e) => onUpdate({ shape: e.target.value as ShapeElement['shape'] })}
          className="h-7 text-sm border rounded px-2 bg-white"
        >
          <option value="rect">Rectángulo</option>
          <option value="ellipse">Elipse</option>
          <option value="line">Línea</option>
          <option value="triangle">Triángulo</option>
          <option value="diamond">Rombo</option>
        </select>
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Color relleno</Label>
        <input
          type="color"
          value={element.fill === 'transparent' ? '#ffffff' : element.fill}
          onChange={(e) => onUpdate({ fill: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Color trazo</Label>
        <input
          type="color"
          value={element.stroke}
          onChange={(e) => onUpdate({ stroke: e.target.value })}
          className="h-8 w-full cursor-pointer rounded border"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Grosor de trazo</Label>
        <Input
          type="number"
          min={0}
          max={20}
          value={element.strokeWidth}
          onChange={(e) => onUpdate({ strokeWidth: Number(e.target.value) })}
          className="h-7 text-sm"
        />
      </div>

      <div className="flex flex-col gap-1">
        <Label className="text-xs">Opacidad ({Math.round(element.opacity * 100)}%)</Label>
        <Slider
          min={0}
          max={1}
          step={0.01}
          value={[element.opacity]}
          onValueChange={(vals) => onUpdate({ opacity: Array.isArray(vals) ? (vals as number[])[0] : (vals as number) })}
        />
      </div>
    </>
  )
}

// ─── Element Properties dispatcher ───────────────────────────────────────────

interface ElementPropertiesProps {
  element: CanvasElement
  onUpdate: (changes: Partial<CanvasElement>) => void
}

function ElementProperties({ element, onUpdate }: ElementPropertiesProps) {
  return (
    <div className="flex flex-col gap-3 p-3 overflow-y-auto">
      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
        Elemento: {element.type}
      </p>

      <CommonProps element={element} onUpdate={onUpdate} />

      <hr />

      {element.type === 'image' && (
        <ImageProps
          element={element}
          onUpdate={(c) => onUpdate(c as Partial<CanvasElement>)}
        />
      )}
      {element.type === 'text' && (
        <TextProps
          element={element}
          onUpdate={(c) => onUpdate(c as Partial<CanvasElement>)}
        />
      )}
      {element.type === 'label' && (
        <LabelProps
          element={element}
          onUpdate={(c) => onUpdate(c as Partial<CanvasElement>)}
        />
      )}
      {element.type === 'arrow' && (
        <ArrowProps
          element={element}
          onUpdate={(c) => onUpdate(c as Partial<CanvasElement>)}
        />
      )}
      {element.type === 'shape' && (
        <ShapeProps
          element={element}
          onUpdate={(c) => onUpdate(c as Partial<CanvasElement>)}
        />
      )}
    </div>
  )
}

// ─── PropertiesPanel (root export) ───────────────────────────────────────────

export default function PropertiesPanel() {
  const {
    currentFicha,
    selectedElementId,
    currentPageIndex,
    updateFichaField,
    updateElement,
    updateCurrentPage,
  } = useFichaStore()

  const page = currentFicha?.pages[currentPageIndex]
  const selectedElement = page?.elements.find((el) => el.id === selectedElementId) ?? null

  if (!currentFicha) return null

  if (selectedElement) {
    return (
      <div className="w-72 bg-white border-l flex-shrink-0 overflow-y-auto">
        <ElementProperties
          element={selectedElement}
          onUpdate={(changes) => updateElement(selectedElement.id, changes)}
        />
      </div>
    )
  }

  // Page 3: show PatternPiecesPanel above FichaMetadataForm
  if (currentPageIndex === 2 && page?.type === 'technical') {
    return (
      <div className="w-72 bg-white border-l flex-shrink-0 overflow-y-auto">
        <PatternPiecesPanel
          page={page}
          onUpdatePieces={(pieces: PatternPiece[]) =>
            updateCurrentPage({ patternPieces: pieces } as Partial<FichaPage>)
          }
          onUpdateMeasurements={(measurements: Measurement[]) =>
            updateCurrentPage({ measurements } as Partial<FichaPage>)
          }
        />
        <FichaMetadataForm ficha={currentFicha} onUpdate={updateFichaField} />
      </div>
    )
  }

  return (
    <div className="w-72 bg-white border-l flex-shrink-0 overflow-y-auto">
      <FichaMetadataForm ficha={currentFicha} onUpdate={updateFichaField} />
    </div>
  )
}
