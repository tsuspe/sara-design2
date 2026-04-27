import type { Page3Technical, Ficha, FichaPage } from '@/types'

interface Page3OverlayProps {
  page: Page3Technical
  ficha: Ficha
  onUpdatePage: (changes: Partial<FichaPage>) => void
  readOnly?: boolean
}

export default function Page3Overlay({ page, ficha }: Page3OverlayProps) {
  const formatDate = (iso: string) => {
    if (!iso) return '—'
    try { return new Date(iso).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' }) }
    catch { return iso }
  }

  const sortedPieces = [...page.patternPieces].sort((a, b) =>
    a.letterRef.toUpperCase().localeCompare(b.letterRef.toUpperCase())
  )
  const hasMeasurements = page.measurements && page.measurements.length > 0
  const hasPieces = sortedPieces.length > 0
  const totalPieces = sortedPieces.reduce((sum, p) => sum + p.quantity, 0)

  return (
    <>
      {/* TOP HEADER: 150px */}
      <div
        className="absolute left-0 right-0 top-0 pointer-events-none bg-white border-b-2 border-gray-900"
        style={{ height: 150, zIndex: 20 }}
      >
        {/* Title bar: 26px */}
        <div
          className="flex items-center justify-between px-4 bg-gray-900 text-white"
          style={{ height: 26 }}
        >
          <span className="text-[11px] font-bold uppercase tracking-widest">Ficha de Despiece de Moldería</span>
          <span className="text-[10px] text-gray-300">Hoja Nº: {ficha.fichaNumber || '—'}</span>
        </div>

        {/* Logo + header grid: 88px */}
        <div className="flex border-b border-gray-300" style={{ height: 88 }}>
          {/* Logo/brand block */}
          <div
            className="flex items-center justify-center border-r border-gray-900 font-black text-gray-900 text-xl tracking-tight bg-white"
            style={{ width: 110 }}
          >
            {ficha.brand || 'MARCA'}
          </div>
          {/* 2-column grid */}
          <div className="flex flex-1 text-[10px]">
            <div className="flex flex-col flex-1 border-r border-gray-300">
              <HCell label="EMPRESA" value={ficha.brand} />
              <HCell label="MARCA" value={ficha.brand} />
              <HCell label="RUBRO" value={ficha.line || '—'} />
              <HCell label="LÍNEA" value={ficha.line || '—'} />
            </div>
            <div className="flex flex-col flex-1">
              <HCell label="Nº DE FICHA" value={ficha.fichaNumber} bold />
              <HCell label="MODELO" value={ficha.modelName} bold />
              <HCell label="ARTÍCULO" value={ficha.article || '—'} />
              <HCell label="TALLE BASE" value={ficha.size || '—'} />
            </div>
          </div>
        </div>

        {/* Description: 36px */}
        <div className="flex items-center px-3 text-[10px]" style={{ height: 36 }}>
          <span className="text-gray-500 font-semibold shrink-0 mr-2">DESCRIPCIÓN:</span>
          <span className="text-gray-800 line-clamp-2">{ficha.description || '—'}</span>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-white border-t-2 border-gray-900 pointer-events-auto"
        style={{ zIndex: 20 }}
      >
        {/* Measurements row */}
        {hasMeasurements && (
          <div className="border-b border-gray-400">
            <table className="w-full text-[9px] border-collapse">
              <thead>
                <tr className="bg-gray-900 text-white">
                  {page.measurements.map((m) => (
                    <th key={m.id} className="border border-gray-700 px-2 py-[3px] font-semibold text-center whitespace-nowrap">
                      {m.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                <tr>
                  {page.measurements.map((m) => (
                    <td key={m.id} className="border border-gray-300 px-2 py-[3px] text-center text-gray-900">
                      {m.value || '—'}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Pattern pieces table */}
        {hasPieces && (
          <div className="border-b border-gray-400">
            <table className="w-full text-[9px] border-collapse">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-400 px-2 py-1 font-bold text-left w-10">REF.</th>
                  <th className="border border-gray-400 px-2 py-1 font-bold text-left">DESCRIPCIÓN</th>
                  <th className="border border-gray-400 px-2 py-1 font-bold text-left w-24">TEXTIL</th>
                  <th className="border border-gray-400 px-2 py-1 font-bold text-center w-24">CANT. CORTES</th>
                </tr>
              </thead>
              <tbody>
                {sortedPieces.map((piece, i) => (
                  <tr key={piece.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                    <td className="border border-gray-300 px-2 py-[3px] font-mono font-bold text-center">{piece.letterRef}</td>
                    <td className="border border-gray-300 px-2 py-[3px]">{piece.name}</td>
                    <td className="border border-gray-300 px-2 py-[3px]">{piece.fabric || '—'}</td>
                    <td className="border border-gray-300 px-2 py-[3px] text-center">
                      {piece.quantity} ({toWord(piece.quantity)})
                    </td>
                  </tr>
                ))}
                <tr className="bg-gray-100 font-semibold">
                  <td colSpan={3} className="border border-gray-400 px-2 py-1 text-right text-[9px]">CANTIDAD TOTAL DE PIEZAS</td>
                  <td className="border border-gray-400 px-2 py-1 text-center text-[9px] font-bold">{totalPieces} U</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}

        {/* Footer */}
        <div className="text-[9px]">
          <div className="flex border-b border-gray-200">
            <div className="flex-1 border-r border-gray-200 px-2 py-1">
              <span className="text-gray-400">FECHA DE EMISIÓN: </span><span className="font-medium">{formatDate(ficha.emissionDate)}</span>
            </div>
            <div className="flex-1 px-2 py-1">
              <span className="text-gray-400">FECHA DE RECEPCIÓN: </span><span className="font-medium">{formatDate(ficha.receptionDate)}</span>
            </div>
          </div>
          <div className="flex border-b border-gray-200">
            <div className="flex-1 border-r border-gray-200 px-2 py-1">
              <span className="text-gray-400">EMPRESA EMISORA: </span><span className="font-medium">{ficha.brand || '—'}</span>
            </div>
            <div className="flex-1 px-2 py-1">
              <span className="text-gray-400">TALLER: </span><span className="font-medium">{ficha.tallerName || '—'}</span>
            </div>
          </div>
          <div className="flex border-b border-gray-200">
            <div className="flex-1 border-r border-gray-200 px-2 py-1">
              <span className="text-gray-400">RESPONSABLE: </span><span className="font-medium">{ficha.designerName || '—'}</span>
            </div>
            <div className="flex-1 px-2 py-1">
              <span className="text-gray-400">RESPONSABLES TALLER: </span><span className="font-medium">{ficha.tallerName || '—'}</span>
            </div>
          </div>
          <div className="flex items-center gap-4 px-2 py-1 flex-wrap">
            <span className="text-gray-400 font-semibold">PROTOTIPO APROBADO:</span>
            <span className={`font-bold px-2 py-0.5 border text-[9px] ${ficha.approvedPrototype === true ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-400 text-gray-600'}`}>SI</span>
            <span className={`font-bold px-2 py-0.5 border text-[9px] ${ficha.approvedPrototype === false ? 'bg-gray-900 text-white border-gray-900' : 'border-gray-400 text-gray-600'}`}>NO</span>
            <span className="text-gray-400 ml-4">MODIFICACIONES: </span>
            <span className="text-gray-700">{ficha.modifications || '—'}</span>
          </div>
        </div>
      </div>
    </>
  )
}

function HCell({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex items-center border-b border-gray-200 flex-1 min-h-0 px-2 gap-1">
      <span className="text-gray-400 font-semibold shrink-0 w-[72px] text-[9px]">{label}:</span>
      <span className={`text-gray-900 truncate ${bold ? 'font-bold' : ''}`}>{value || '—'}</span>
    </div>
  )
}

function toWord(n: number): string {
  const w: Record<number, string> = { 1:'uno',2:'dos',3:'tres',4:'cuatro',5:'cinco',6:'seis',7:'siete',8:'ocho',9:'nueve',10:'diez' }
  return w[n] ?? String(n)
}
