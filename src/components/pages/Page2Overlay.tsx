import { useRef } from 'react'
import type { Page2Graphic, Ficha, FichaPage } from '@/types'

interface Page2OverlayProps {
  page: Page2Graphic
  ficha: Ficha
  onUpdatePage: (changes: Partial<FichaPage>) => void
  onUpdateFicha: (changes: Partial<Omit<Ficha, 'pages'>>) => void
  readOnly?: boolean
}

export default function Page2Overlay({
  page,
  ficha,
  onUpdatePage,
  onUpdateFicha: _onUpdateFicha,
  readOnly = false,
}: Page2OverlayProps) {
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const approvedLabel =
    ficha.approvedPrototype === null
      ? '—'
      : ficha.approvedPrototype
        ? 'Sí'
        : 'No'

  const handleColorChange = (index: number, color: string) => {
    const updated = [...page.colorPalette]
    updated[index] = color
    onUpdatePage({ colorPalette: updated } as Partial<FichaPage>)
  }

  const handleAddColor = () => {
    onUpdatePage({ colorPalette: [...page.colorPalette, '#000000'] } as Partial<FichaPage>)
  }

  const handleTitleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    onUpdatePage({ pageTitle: e.currentTarget.textContent ?? '' } as Partial<FichaPage>)
  }

  return (
    <div
      className="absolute left-0 right-0 bottom-0 bg-gray-50 border-t border-gray-200 flex flex-col"
      style={{ height: 280, zIndex: 10 }}
    >
      {/* Page Title */}
      <div className="border-b border-gray-200 px-3 py-1">
        <div
          contentEditable={!readOnly}
          suppressContentEditableWarning
          onBlur={handleTitleBlur}
          className="text-sm font-semibold text-gray-800 outline-none min-h-[1.5rem] focus:bg-white focus:ring-1 focus:ring-gray-300 rounded px-1"
          style={{ cursor: readOnly ? 'default' : 'text' }}
        >
          {page.pageTitle}
        </div>
      </div>

      {/* Color Palette */}
      <div className="border-b border-gray-200 px-3 py-2 flex items-center gap-2 flex-wrap">
        <span className="text-xs text-gray-500 font-medium mr-1">Paleta:</span>
        {page.colorPalette.map((color, i) => (
          <div key={i} className="relative">
            <button
              type="button"
              onClick={() => {
                if (!readOnly) colorInputRefs.current[i]?.click()
              }}
              className="w-6 h-6 rounded-full border border-gray-300 shadow-sm hover:scale-110 transition-transform"
              style={{ backgroundColor: color }}
              title={color}
            />
            {!readOnly && (
              <input
                ref={(el) => { colorInputRefs.current[i] = el }}
                type="color"
                value={color}
                onChange={(e) => handleColorChange(i, e.target.value)}
                className="absolute opacity-0 w-0 h-0 pointer-events-none"
                tabIndex={-1}
              />
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={handleAddColor}
            className="w-6 h-6 rounded-full border-2 border-dashed border-gray-400 text-gray-400 flex items-center justify-center text-xs hover:border-gray-600 hover:text-gray-600 transition-colors"
            title="Añadir color"
          >
            +
          </button>
        )}
      </div>

      {/* Data Grid */}
      <div className="flex flex-1 min-h-0">
        {/* Left column */}
        <div className="flex-1 border-r border-gray-200 p-2 flex flex-col gap-1">
          <Row label="Modelo" value={ficha.modelName} />
          <Row label="Técnica" value={ficha.printTechnique} />
          <Row label="Gramaje" value={ficha.gsm ? `${ficha.gsm} gsm` : '—'} />
          <Row label="Nº Ficha" value={ficha.fichaNumber} />
        </div>
        {/* Right column */}
        <div className="flex-1 p-2 flex flex-col gap-1">
          <Row label="Taller" value={ficha.tallerName} />
          <Row label="Fecha emisión" value={ficha.emissionDate || '—'} />
          <Row label="Fecha recepción" value={ficha.receptionDate || '—'} />
          <Row label="Aprobado" value={approvedLabel} />
        </div>
      </div>
    </div>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex gap-1 text-xs leading-tight">
      <span className="text-gray-500 font-medium shrink-0">{label}:</span>
      <span className="text-gray-800 truncate">{value || '—'}</span>
    </div>
  )
}
