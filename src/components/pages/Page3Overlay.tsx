import { useRef } from 'react'
import type { Page3Technical, Ficha, FichaPage } from '@/types'
import { fileToDataUrl, resizeImage } from '@/utils/imageUtils'

interface Page3OverlayProps {
  page: Page3Technical
  ficha: Ficha
  onUpdatePage: (changes: Partial<FichaPage>) => void
  readOnly?: boolean
}

export default function Page3Overlay({
  page,
  ficha,
  onUpdatePage,
  readOnly = false,
}: Page3OverlayProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)

  const approvedLabel =
    ficha.approvedPrototype === null
      ? '—'
      : ficha.approvedPrototype
        ? 'Sí'
        : 'No'

  const handleThumbnailClick = () => {
    if (!readOnly) fileInputRef.current?.click()
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    try {
      const dataUrl = await fileToDataUrl(file)
      const resized = await resizeImage(dataUrl, 400, 500)
      onUpdatePage({ garmentThumbnailData: resized } as Partial<FichaPage>)
    } catch (err) {
      console.error('Error loading thumbnail:', err)
    }
    // Reset input so same file can be re-selected
    e.target.value = ''
  }

  const sortedPieces = [...page.patternPieces].sort((a, b) =>
    a.letterRef.toUpperCase().localeCompare(b.letterRef.toUpperCase())
  )

  return (
    <>
      {/* ── HEADER (h-24) ── */}
      <div
        className="absolute left-0 right-0 top-0 bg-gray-50 border-b border-gray-200 pointer-events-auto"
        style={{ height: 96, zIndex: 10 }}
      >
        <div className="h-full px-3 py-2 flex flex-col justify-between">
          {/* Top row */}
          <div className="flex gap-4 text-xs">
            <HeaderItem label="Título" value={ficha.title} bold />
            <HeaderItem label="Modelo" value={ficha.modelName} />
            <HeaderItem label="Nº Ficha" value={ficha.fichaNumber} />
            <HeaderItem label="Taller" value={ficha.tallerName} />
          </div>
          {/* Bottom row */}
          <div className="flex gap-4 text-xs">
            <HeaderItem label="Fecha emisión" value={ficha.emissionDate || '—'} />
            <HeaderItem label="Fecha recepción" value={ficha.receptionDate || '—'} />
            <HeaderItem label="Aprobado" value={approvedLabel} />
            <HeaderItem label="Técnica" value={ficha.printTechnique} />
            <HeaderItem label="Gramaje" value={ficha.gsm ? `${ficha.gsm} gsm` : '—'} />
          </div>
        </div>
      </div>

      {/* ── THUMBNAIL ZONE (h-96, top=96, centered) ── */}
      <div
        className="absolute left-0 right-0 flex items-center justify-center pointer-events-auto"
        style={{ top: 96, height: 384, zIndex: 10 }}
      >
        <button
          type="button"
          onClick={handleThumbnailClick}
          className={`relative flex items-center justify-center border-2 rounded-lg overflow-hidden transition-colors ${
            readOnly
              ? 'border-transparent cursor-default'
              : page.garmentThumbnailData
                ? 'border-transparent hover:border-gray-300 cursor-pointer'
                : 'border-dashed border-gray-300 hover:border-gray-500 cursor-pointer bg-gray-50 hover:bg-gray-100'
          }`}
          style={{ width: 260, height: 340 }}
          title={readOnly ? undefined : 'Clic para subir imagen de prenda'}
        >
          {page.garmentThumbnailData ? (
            <img
              src={page.garmentThumbnailData}
              alt="Prenda"
              className="max-w-full max-h-full object-contain"
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-gray-400 pointer-events-none">
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
              >
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <circle cx="8.5" cy="8.5" r="1.5" />
                <polyline points="21 15 16 10 5 21" />
              </svg>
              <span className="text-xs text-center px-2">
                Clic para subir imagen de prenda
              </span>
            </div>
          )}
        </button>

        {!readOnly && (
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        )}
      </div>

      {/* ── SUMMARY TABLE (bottom, auto-height) ── */}
      {sortedPieces.length > 0 && (
        <div
          className="absolute left-0 right-0 bottom-0 bg-white border-t border-gray-200 pointer-events-auto"
          style={{ zIndex: 10 }}
        >
          <table className="w-full text-xs border-collapse">
            <thead>
              <tr className="bg-gray-100 border-b border-gray-300">
                <th className="border border-gray-300 px-2 py-1 text-left font-semibold w-10">Ref</th>
                <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Nombre pieza</th>
                <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Tela</th>
                <th className="border border-gray-300 px-2 py-1 text-center font-semibold w-14">Cant.</th>
                <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Notas</th>
              </tr>
            </thead>
            <tbody>
              {sortedPieces.map((piece, i) => (
                <tr key={piece.id} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="border border-gray-200 px-2 py-1 font-mono font-bold text-center">
                    {piece.letterRef}
                  </td>
                  <td className="border border-gray-200 px-2 py-1">{piece.name}</td>
                  <td className="border border-gray-200 px-2 py-1">{piece.fabric || '—'}</td>
                  <td className="border border-gray-200 px-2 py-1 text-center">{piece.quantity}</td>
                  <td className="border border-gray-200 px-2 py-1 text-gray-600">{piece.notes || ''}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}

function HeaderItem({ label, value, bold }: { label: string; value: string; bold?: boolean }) {
  return (
    <div className="flex gap-1 items-baseline">
      <span className="text-gray-500 font-medium shrink-0">{label}:</span>
      <span className={`text-gray-800 truncate ${bold ? 'font-semibold' : ''}`}>{value || '—'}</span>
    </div>
  )
}
