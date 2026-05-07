import { useRef, useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Page4Phases, PhaseRow, FichaPage, ColumnStyle } from '@/types'
import { PESPUNTES_CATALOG, getPespunteBySrc } from '@/data/pespuntesCatalog'
import { Plus, Trash2 } from 'lucide-react'

interface Page4OverlayProps {
  page: Page4Phases
  onUpdatePage: (changes: Partial<FichaPage>) => void
  readOnly?: boolean
}

const COLUMNS = [
  { key: 'fase', label: 'Fase' },
  { key: 'descripcion', label: 'Descripción' },
  { key: 'maquina', label: 'Máquina' },
  { key: 'grafico', label: 'Gráficos' },
  { key: 'observaciones', label: 'Observaciones' },
] as const

function createEmptyRow(): PhaseRow {
  return {
    id: uuidv4(),
    fase: '',
    descripcion: '',
    maquina: '',
    grafico: '',
    observaciones: '',
  }
}

export default function Page4Overlay({ page, onUpdatePage, readOnly }: Page4OverlayProps) {
  const hasObservaciones = page.phases.some((r) => r.observaciones.trim() !== '')
  const resizingRef = useRef<{ col: string; startX: number; startW: number } | null>(null)
  const columnWidthsRef = useRef(page.columnWidths)
  columnWidthsRef.current = page.columnWidths
  const onUpdatePageRef = useRef(onUpdatePage)
  onUpdatePageRef.current = onUpdatePage
  const [editingHeader, setEditingHeader] = useState<string | null>(null)

  const visibleColumns = COLUMNS.filter(
    (col) => col.key !== 'observaciones' || !readOnly || hasObservaciones
  )

  const getColWidth = (key: string) => page.columnWidths[key] ?? 100

  const updateRow = useCallback(
    (rowId: string, field: keyof PhaseRow, value: string) => {
      const phases = page.phases.map((r) =>
        r.id === rowId ? { ...r, [field]: value } : r
      )
      onUpdatePage({ phases } as Partial<FichaPage>)
    },
    [page.phases, onUpdatePage]
  )

  const addRow = useCallback(() => {
    onUpdatePage({
      phases: [...page.phases, createEmptyRow()],
    } as Partial<FichaPage>)
  }, [page.phases, onUpdatePage])

  const removeRow = useCallback(
    (rowId: string) => {
      onUpdatePage({
        phases: page.phases.filter((r) => r.id !== rowId),
      } as Partial<FichaPage>)
    },
    [page.phases, onUpdatePage]
  )

  const updateColumnStyle = useCallback(
    (colKey: string, changes: Partial<ColumnStyle>) => {
      const current = page.columnStyles[colKey] ?? {
        backgroundColor: '#f3f4f6',
        textColor: '#111827',
        fontFamily: 'Arial, sans-serif',
        fontWeight: 'bold' as const,
        fontStyle: 'normal' as const,
      }
      onUpdatePage({
        columnStyles: {
          ...page.columnStyles,
          [colKey]: { ...current, ...changes },
        },
      } as Partial<FichaPage>)
    },
    [page.columnStyles, onUpdatePage]
  )

  // Column resize handlers
  const handleResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, colKey: string) => {
      e.preventDefault()
      e.stopPropagation()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      resizingRef.current = { col: colKey, startX: clientX, startW: getColWidth(colKey) }

      const handleMove = (ev: MouseEvent | TouchEvent) => {
        if (!resizingRef.current) return
        const cx = 'touches' in ev ? ev.touches[0].clientX : (ev as MouseEvent).clientX
        const delta = cx - resizingRef.current.startX
        const newW = Math.max(30, resizingRef.current.startW + delta)
        onUpdatePageRef.current({
          columnWidths: { ...columnWidthsRef.current, [resizingRef.current.col]: newW },
        } as Partial<FichaPage>)
      }

      const handleEnd = () => {
        resizingRef.current = null
        document.removeEventListener('mousemove', handleMove)
        document.removeEventListener('mouseup', handleEnd)
        document.removeEventListener('touchmove', handleMove)
        document.removeEventListener('touchend', handleEnd)
      }

      document.addEventListener('mousemove', handleMove)
      document.addEventListener('mouseup', handleEnd)
      document.addEventListener('touchmove', handleMove, { passive: false })
      document.addEventListener('touchend', handleEnd)
    },
    []
  )

  const getHeaderStyle = (colKey: string): React.CSSProperties => {
    const s = page.columnStyles[colKey]
    if (!s) return {}
    return {
      backgroundColor: s.backgroundColor,
      color: s.textColor,
      fontFamily: s.fontFamily,
      fontWeight: s.fontWeight,
      fontStyle: s.fontStyle,
    }
  }

  return (
    <div
      className="absolute inset-0 flex flex-col pointer-events-auto"
      style={{ zIndex: 20, padding: '38px 30px' }}
    >
      {/* Title */}
      <div className="text-center mb-2">
        <h1 className="text-2xl font-bold tracking-wide">LISTA DE FASES</h1>
      </div>

      {/* Garment name */}
      <div className="mb-3 flex items-center gap-1">
        <span className="font-bold text-sm">PRENDA:</span>
        {readOnly ? (
          <span className="text-sm">{page.garmentName || '—'}</span>
        ) : (
          <input
            type="text"
            value={page.garmentName}
            onChange={(e) => onUpdatePage({ garmentName: e.target.value } as Partial<FichaPage>)}
            className="border-b border-gray-400 bg-transparent text-sm px-1 flex-1 outline-none focus:border-gray-900"
            placeholder="Nombre de la prenda"
          />
        )}
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        <table className="border-collapse text-[10px]" style={{ tableLayout: 'fixed' }}>
          <colgroup>
            {visibleColumns.map((col) => (
              <col key={col.key} style={{ width: getColWidth(col.key) }} />
            ))}
            {!readOnly && <col style={{ width: 28 }} />}
          </colgroup>
          <thead>
            <tr>
              {visibleColumns.map((col) => (
                <th
                  key={col.key}
                  className="border border-gray-400 px-2 py-1 text-center relative select-none"
                  style={getHeaderStyle(col.key)}
                  onClick={() => !readOnly && setEditingHeader(editingHeader === col.key ? null : col.key)}
                >
                  {col.label}
                  {/* Resize handle */}
                  {!readOnly && (
                    <div
                      className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-blue-300/50"
                      onMouseDown={(e) => handleResizeStart(e, col.key)}
                      onTouchStart={(e) => handleResizeStart(e, col.key)}
                      onClick={(e) => e.stopPropagation()}
                    />
                  )}
                </th>
              ))}
              {!readOnly && <th className="w-7" />}
            </tr>
          </thead>
          <tbody>
            {page.phases.map((row) => (
              <tr key={row.id}>
                {visibleColumns.map((col) => (
                  <td key={col.key} className="border border-gray-300 px-1 py-1 align-top">
                    {col.key === 'grafico' ? (
                      <GraphicCell
                        value={row.grafico}
                        onChange={(v) => updateRow(row.id, 'grafico', v)}
                        readOnly={readOnly}
                      />
                    ) : readOnly ? (
                      <span className="break-words">{row[col.key as keyof PhaseRow]}</span>
                    ) : (
                      <EditableCell
                        value={row[col.key as keyof PhaseRow]}
                        onChange={(v) => updateRow(row.id, col.key as keyof PhaseRow, v)}
                      />
                    )}
                  </td>
                ))}
                {!readOnly && (
                  <td className="border-none px-0 align-middle">
                    <button
                      onClick={() => removeRow(row.id)}
                      className="p-0.5 text-red-400 hover:text-red-600 opacity-60 hover:opacity-100"
                      title="Eliminar fila"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Add row button */}
        {!readOnly && (
          <button
            onClick={addRow}
            className="mt-2 flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-800 border border-dashed border-gray-300 rounded px-2 py-1 hover:border-gray-500"
          >
            <Plus className="w-3 h-3" /> Añadir fila
          </button>
        )}
      </div>

      {/* Footer: NOMBRE */}
      <div className="mt-auto pt-3 border-t border-gray-400">
        <div className="flex items-center gap-1">
          <span className="font-bold text-sm">NOMBRE:</span>
          {readOnly ? (
            <span className="text-sm">{page.responsibleName || '—'}</span>
          ) : (
            <input
              type="text"
              value={page.responsibleName}
              onChange={(e) =>
                onUpdatePage({ responsibleName: e.target.value } as Partial<FichaPage>)
              }
              className="border-b border-gray-400 bg-transparent text-sm px-1 flex-1 outline-none focus:border-gray-900"
              placeholder="Nombre del responsable"
            />
          )}
        </div>
      </div>

      {/* Header style editor popup */}
      {!readOnly && editingHeader && (
        <HeaderStyleEditor
          colKey={editingHeader}
          style={page.columnStyles[editingHeader]}
          onUpdate={(changes) => updateColumnStyle(editingHeader, changes)}
          onClose={() => setEditingHeader(null)}
        />
      )}
    </div>
  )
}

// ─── Editable Cell ───────────────────────────────────────────────────────────

function EditableCell({
  value,
  onChange,
}: {
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent outline-none text-[10px] min-h-[20px]"
    />
  )
}

// ─── Graphic Cell ────────────────────────────────────────────────────────────

function GraphicCell({
  value,
  onChange,
  readOnly,
}: {
  value: string
  onChange: (v: string) => void
  readOnly?: boolean
}) {
  const graphic = getPespunteBySrc(value)

  if (readOnly) {
    return graphic ? (
      <img src={graphic.src} alt={graphic.label} className="h-5 mx-auto object-contain" />
    ) : null
  }

  return (
    <div className="flex flex-col items-center gap-0.5">
      {graphic && (
        <img src={graphic.src} alt={graphic.label} className="h-5 object-contain" />
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="text-[9px] bg-white border rounded w-full"
      >
        <option value="">— Seleccionar —</option>
        {PESPUNTES_CATALOG.map((p) => (
          <option key={p.key} value={p.key}>
            {p.label}
          </option>
        ))}
      </select>
    </div>
  )
}

// ─── Header Style Editor ─────────────────────────────────────────────────────

function HeaderStyleEditor({
  colKey,
  style,
  onUpdate,
  onClose,
}: {
  colKey: string
  style?: ColumnStyle
  onUpdate: (changes: Partial<ColumnStyle>) => void
  onClose: () => void
}) {
  const s = style ?? {
    backgroundColor: '#f3f4f6',
    textColor: '#111827',
    fontFamily: 'Arial, sans-serif',
    fontWeight: 'bold' as const,
    fontStyle: 'normal' as const,
  }

  const colLabel = COLUMNS.find((c) => c.key === colKey)?.label ?? colKey

  return (
    <div
      className="absolute top-16 left-1/2 -translate-x-1/2 bg-white border border-gray-300 rounded-lg shadow-lg p-3 z-50"
      style={{ minWidth: 220 }}
      onClick={(e) => e.stopPropagation()}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-semibold">Estilo: {colLabel}</span>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-700 text-xs">
          ✕
        </button>
      </div>

      <div className="flex flex-col gap-2 text-[10px]">
        <div className="flex items-center gap-2">
          <label className="w-16 shrink-0">Fondo</label>
          <input
            type="color"
            value={s.backgroundColor}
            onChange={(e) => onUpdate({ backgroundColor: e.target.value })}
            className="h-6 w-10 cursor-pointer rounded border"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-16 shrink-0">Letra</label>
          <input
            type="color"
            value={s.textColor}
            onChange={(e) => onUpdate({ textColor: e.target.value })}
            className="h-6 w-10 cursor-pointer rounded border"
          />
        </div>

        <div className="flex items-center gap-2">
          <label className="w-16 shrink-0">Fuente</label>
          <select
            value={s.fontFamily}
            onChange={(e) => onUpdate({ fontFamily: e.target.value })}
            className="text-[10px] border rounded px-1 py-0.5 flex-1"
          >
            <option value="Arial, sans-serif">Arial</option>
            <option value="Helvetica, Arial, sans-serif">Helvetica</option>
            <option value="'Times New Roman', serif">Times</option>
            <option value="Georgia, serif">Georgia</option>
            <option value="Verdana, sans-serif">Verdana</option>
            <option value="'Courier New', monospace">Courier</option>
          </select>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={s.fontWeight === 'bold'}
              onChange={(e) => onUpdate({ fontWeight: e.target.checked ? 'bold' : 'normal' })}
              className="rounded"
            />
            <span>Negrita</span>
          </label>
          <label className="flex items-center gap-1 cursor-pointer">
            <input
              type="checkbox"
              checked={s.fontStyle === 'italic'}
              onChange={(e) => onUpdate({ fontStyle: e.target.checked ? 'italic' : 'normal' })}
              className="rounded"
            />
            <span>Cursiva</span>
          </label>
        </div>
      </div>
    </div>
  )
}
