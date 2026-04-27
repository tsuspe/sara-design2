import type { Ficha } from '@/types'

interface Page1OverlayProps {
  ficha: Ficha
  onUpdateFicha?: (changes: Partial<Omit<Ficha, 'pages'>>) => void
  readOnly?: boolean
}

export default function Page1Overlay({ ficha }: Page1OverlayProps) {
  const formatDate = (iso: string) => {
    if (!iso) return '—'
    try { return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
    catch { return iso }
  }

  return (
    <>
      {/* TOP HEADER: 116px */}
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
          <div className="flex-1 flex items-center px-4 gap-4">
            <span className="text-2xl font-bold tracking-wide uppercase text-gray-900 truncate">
              {ficha.modelName || ficha.title || 'MODELO'}
            </span>
          </div>
          <div className="flex items-center justify-center px-4 border-l border-gray-300 text-[10px] text-center">
            <div>
              <div className="text-gray-400 text-[8px] uppercase tracking-wide">Hoja Nº</div>
              <div className="font-bold text-gray-900">{ficha.fichaNumber || '01'}</div>
            </div>
          </div>
        </div>

        {/* Data grid: 3 cols × 3 rows, 66px total */}
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
            <DataCell label="Gsm" value={ficha.gsm ? `${ficha.gsm}` : '—'} />
            <DataCell label="Date" value={formatDate(ficha.emissionDate)} />
            <DataCell label="Designer" value={ficha.designerName} />
          </div>
        </div>
      </div>

      {/* BOTTOM STRIP: 50px (black brand bar) */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-gray-900 text-white pointer-events-none flex items-center justify-between px-6"
        style={{ height: 50, zIndex: 20 }}
      >
        <span className="text-base font-black tracking-widest uppercase">{ficha.brand || 'MARCA'}</span>
        <span className="text-xs text-gray-400 uppercase tracking-wide">{ficha.designerName}</span>
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
