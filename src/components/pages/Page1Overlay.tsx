import type { Ficha } from '@/types'

interface Page1OverlayProps {
  ficha: Ficha
  onUpdateFicha?: (changes: Partial<Omit<Ficha, 'pages'>>) => void
  readOnly?: boolean
}

export default function Page1Overlay({ ficha }: Page1OverlayProps) {
  const formatDate = (iso: string) => {
    if (!iso) return new Date().getFullYear().toString()
    try {
      return new Date(iso).toLocaleDateString('es-ES', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
      })
    } catch {
      return iso
    }
  }

  const titleFont = ficha.titleFontFamily ?? 'Impact, sans-serif'
  const bodyFont = ficha.bodyFontFamily ?? 'Arial, sans-serif'
  const title = ficha.modelName || ficha.title || 'MODELO'
  const footer = ficha.brand || ficha.designerName || 'SARA DESIGN'

  return (
    <>
      <div
        className="absolute pointer-events-none"
        style={{ inset: 12, border: '4px solid #111827', zIndex: 10 }}
      />

      <div
        className="absolute pointer-events-none"
        style={{
          left: 52,
          right: 52,
          top: 178,
          bottom: 74,
          zIndex: 1,
          border: '3px solid #111827',
          backgroundColor: '#ffffff',
          backgroundImage:
            'linear-gradient(rgba(173,216,230,0.45) 1px, transparent 1px), linear-gradient(90deg, rgba(173,216,230,0.45) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
        }}
      />

      <div
        className="absolute left-[52px] right-[52px] pointer-events-none bg-white text-center"
        style={{
          top: 158,
          height: 20,
          zIndex: 21,
          borderLeft: '3px solid #111827',
          borderRight: '3px solid #111827',
          borderTop: '3px solid #111827',
          fontFamily: bodyFont,
          fontSize: 12,
          fontWeight: 900,
          letterSpacing: 0.6,
          lineHeight: '17px',
        }}
      >
        DETAIL AFTER PURCHASE
      </div>

      <div
        className="absolute pointer-events-none bg-white"
        style={{
          left: 40,
          right: 40,
          top: 40,
          height: 118,
          zIndex: 20,
          border: '3px solid #111827',
        }}
      >
        <div
          className="flex items-center px-4 overflow-hidden"
          style={{ height: 45, borderBottom: '3px solid #111827' }}
        >
          <span
            className="uppercase truncate"
            style={{
              fontFamily: titleFont,
              fontSize: ficha.titleFontSize ?? 46,
              fontWeight: ficha.titleFontWeight ?? 'bold',
              fontStyle: ficha.titleFontStyle ?? 'normal',
              color: '#25385c',
              letterSpacing: 1,
              lineHeight: '42px',
            }}
          >
            {title}
          </span>
        </div>

        <div
          className="flex text-[12px] font-bold"
          style={{ height: 73, fontFamily: bodyFont }}
        >
          <div className="flex flex-col flex-1" style={{ borderRight: '3px solid #111827' }}>
            <DataCell label="Brand" value={ficha.brand} />
            <DataCell label="Season" value={ficha.season} />
            <DataCell label="Line" value={ficha.line} />
          </div>
          <div className="flex flex-col flex-1" style={{ borderRight: '3px solid #111827' }}>
            <DataCell label="Model" value={ficha.modelName} />
            <DataCell label="Article" value={ficha.article} />
            <DataCell label="Size" value={ficha.size} />
          </div>
          <div className="flex flex-col flex-1">
            <DataCell label="Date" value={formatDate(ficha.emissionDate)} />
            <DataCell label="Reception" value={formatDate(ficha.receptionDate)} />
            <DataCell label="Designer" value={ficha.designerName} />
          </div>
        </div>
      </div>

      <div
        className="absolute pointer-events-none flex items-center justify-center bg-white"
        style={{
          left: 52,
          right: 52,
          bottom: 22,
          height: 50,
          zIndex: 20,
          borderLeft: '3px solid #111827',
          borderRight: '3px solid #111827',
          borderBottom: '3px solid #111827',
        }}
      >
        <span
          className="uppercase truncate"
          style={{
            fontFamily: titleFont,
            fontSize: 34,
            fontWeight: 900,
            letterSpacing: 2,
            color: '#25385c',
          }}
        >
          {footer}
        </span>
      </div>
    </>
  )
}

function DataCell({ label, value }: { label: string; value: string }) {
  return (
    <div
      className="flex items-center gap-1 px-2 flex-1 min-h-0"
      style={{ borderBottom: '3px solid #111827' }}
    >
      <span className="text-gray-900 font-black shrink-0">{label} :</span>
      <span className="text-gray-900 truncate">{value || 'None'}</span>
    </div>
  )
}
