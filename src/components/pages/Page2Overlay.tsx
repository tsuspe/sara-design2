import { useRef } from 'react'
import type { Page2Graphic, Ficha, FichaPage } from '@/types'

interface Page2OverlayProps {
  page: Page2Graphic
  ficha: Ficha
  onUpdatePage: (changes: Partial<FichaPage>) => void
  onUpdateFicha: (changes: Partial<Omit<Ficha, 'pages'>>) => void
  readOnly?: boolean
}

export default function Page2Overlay({ page, ficha, onUpdatePage, readOnly = false }: Page2OverlayProps) {
  const colorInputRefs = useRef<(HTMLInputElement | null)[]>([])

  const formatDate = (iso: string) => {
    if (!iso) return '—'
    try { return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
    catch { return iso }
  }

  const handleColorChange = (index: number, color: string) => {
    const updated = [...page.colorPalette]
    updated[index] = color
    onUpdatePage({ colorPalette: updated } as Partial<FichaPage>)
  }

  const handleAddColor = () => {
    onUpdatePage({ colorPalette: [...page.colorPalette, '#000000'] } as Partial<FichaPage>)
  }

  const handleRemoveColor = (index: number) => {
    const updated = page.colorPalette.filter((_, i) => i !== index)
    onUpdatePage({ colorPalette: updated } as Partial<FichaPage>)
  }

  const handleTitleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
    onUpdatePage({ pageTitle: e.currentTarget.textContent ?? '' } as Partial<FichaPage>)
  }

  return (
    <>
      {/* TOP HEADER: 116px (same as Page1) */}
      <div
        className="absolute left-0 right-0 top-0 border-b-2 border-gray-900 pointer-events-none bg-white"
        style={{ height: 116, zIndex: 20 }}
      >
        {/* Title row: 50px */}
        <div className="flex border-b border-gray-900" style={{ height: 50 }}>
          <div
            className="flex items-center justify-center px-4 bg-gray-900 text-white font-bold text-sm uppercase tracking-wider"
            style={{ minWidth: 120 }}
          >
            {ficha.brand || 'MARCA'}
          </div>
          <div className="flex-1 flex items-center px-4">
            {/* pageTitle is editable */}
            <div
              contentEditable={!readOnly}
              suppressContentEditableWarning
              onBlur={handleTitleBlur}
              className="text-2xl font-bold tracking-wide uppercase text-gray-900 outline-none truncate"
              style={{
                cursor: readOnly ? 'default' : 'text',
                pointerEvents: readOnly ? 'none' : 'auto',
                minWidth: 80,
              }}
            >
              {page.pageTitle || ficha.modelName || 'MODELO'}
            </div>
          </div>
          <div className="flex items-center justify-center px-4 border-l border-gray-300 text-[10px] text-center">
            <div>
              <div className="text-gray-400 text-[8px] uppercase tracking-wide">Hoja Nº</div>
              <div className="font-bold text-gray-900">{ficha.fichaNumber || '01'}</div>
            </div>
          </div>
        </div>

        {/* Data grid: same as Page1 */}
        <div className="flex text-[10px]" style={{ height: 66 }}>
          <div className="flex flex-col flex-1 border-r border-gray-200">
            <DataCell label="Brand" value={ficha.brand} />
            <DataCell label="Season" value={ficha.season} />
            <DataCell label="Fabric" value={ficha.fabric} />
          </div>
          <div className="flex flex-col flex-1 border-r border-gray-200">
            <DataCell label="Fabrics Detail" value={ficha.fabric} />
            <DataCell label="Print" value={ficha.printTechnique} />
            <DataCell label="Size" value={ficha.size} />
          </div>
          <div className="flex flex-col flex-1">
            <DataCell label="Gsm" value={ficha.gsm || '—'} />
            <DataCell label="Date" value={formatDate(ficha.emissionDate)} />
            <DataCell label="Designer" value={ficha.designerName} />
          </div>
        </div>
      </div>

      {/* BOTTOM COLOUR PALETTE STRIP: 50px */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-white border-t-2 border-gray-900 pointer-events-auto flex items-center gap-3 px-4"
        style={{ height: 50, zIndex: 20 }}
      >
        <span className="text-[9px] uppercase tracking-widest text-gray-400 shrink-0 mr-1">Colour pallet</span>
        {page.colorPalette.map((color, i) => (
          <div key={i} className="relative group shrink-0">
            <button
              type="button"
              onClick={() => !readOnly && colorInputRefs.current[i]?.click()}
              className="w-7 h-7 rounded-full border border-gray-300 shadow-sm block"
              style={{ backgroundColor: color }}
              title={color}
            />
            {!readOnly && (
              <>
                <input
                  ref={(el) => { colorInputRefs.current[i] = el }}
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(i, e.target.value)}
                  className="absolute opacity-0 w-0 h-0"
                  style={{ pointerEvents: 'none' }}
                />
                <button
                  type="button"
                  onClick={() => handleRemoveColor(i)}
                  className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-white text-[9px] hidden group-hover:flex items-center justify-center leading-none"
                >×</button>
              </>
            )}
          </div>
        ))}
        {!readOnly && (
          <button
            type="button"
            onClick={handleAddColor}
            className="w-7 h-7 rounded-full border-2 border-dashed border-gray-300 text-gray-400 flex items-center justify-center hover:border-gray-600 hover:text-gray-600 shrink-0 text-lg leading-none"
          >+</button>
        )}
        <div className="flex-1" />
        <span className="text-sm font-black tracking-widest uppercase text-gray-900">{ficha.brand}</span>
      </div>
    </>
  )
}

function DataCell({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center gap-1 px-3 border-b border-gray-100 flex-1 min-h-0">
      <span className="text-gray-400 font-medium shrink-0 w-[78px]">{label}:</span>
      <span className="text-gray-900 truncate">{value || '—'}</span>
    </div>
  )
}
