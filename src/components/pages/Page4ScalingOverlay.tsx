import { useRef, useCallback, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { Page4Scaling, ScalingColumn, ScalingRow, FichaPage } from '@/types'
import { Plus, Trash2, X } from 'lucide-react'

interface Page4ScalingOverlayProps {
  page: Page4Scaling
  onUpdatePage: (changes: Partial<FichaPage>) => void
  readOnly?: boolean
}

const TABLE_TOP = 580       // y where the bottom table zone starts within A4 page
const TABLE_PADDING_X = 24

function createEmptyRow(columns: ScalingColumn[]): ScalingRow {
  return {
    id: uuidv4(),
    values: Object.fromEntries(columns.map((c) => [c.id, ''])),
  }
}

export default function Page4ScalingOverlay({ page, onUpdatePage, readOnly }: Page4ScalingOverlayProps) {
  const resizingRef = useRef<{ col: string; startX: number; startW: number } | null>(null)
  const columnWidthsRef = useRef(page.columnWidths)
  columnWidthsRef.current = page.columnWidths
  const onUpdatePageRef = useRef(onUpdatePage)
  onUpdatePageRef.current = onUpdatePage
  const [editingHeader, setEditingHeader] = useState<string | null>(null)

  const getColWidth = (id: string) => page.columnWidths[id] ?? 60

  const updateCell = useCallback(
    (rowId: string, colId: string, value: string) => {
      const rows = page.rows.map((r) =>
        r.id === rowId ? { ...r, values: { ...r.values, [colId]: value } } : r
      )
      onUpdatePage({ rows } as Partial<FichaPage>)
    },
    [page.rows, onUpdatePage]
  )

  const addRow = useCallback(() => {
    onUpdatePage({ rows: [...page.rows, createEmptyRow(page.columns)] } as Partial<FichaPage>)
  }, [page.rows, page.columns, onUpdatePage])

  const removeRow = useCallback(
    (rowId: string) => {
      onUpdatePage({ rows: page.rows.filter((r) => r.id !== rowId) } as Partial<FichaPage>)
    },
    [page.rows, onUpdatePage]
  )

  const renameColumn = useCallback(
    (colId: string, label: string) => {
      const columns = page.columns.map((c) => (c.id === colId ? { ...c, label } : c))
      onUpdatePage({ columns } as Partial<FichaPage>)
    },
    [page.columns, onUpdatePage]
  )

  const handleResizeStart = useCallback(
    (e: React.MouseEvent | React.TouchEvent, colId: string) => {
      e.preventDefault()
      e.stopPropagation()
      const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX
      resizingRef.current = { col: colId, startX: clientX, startW: getColWidth(colId) }

      const handleMove = (ev: MouseEvent | TouchEvent) => {
        if (!resizingRef.current) return
        const cx = 'touches' in ev ? ev.touches[0].clientX : (ev as MouseEvent).clientX
        const delta = cx - resizingRef.current.startX
        const newW = Math.max(28, resizingRef.current.startW + delta)
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

  return (
    <>
      {/* Title at top */}
      <div
        className="absolute left-0 right-0 pointer-events-none text-center"
        style={{ top: 16, zIndex: 20 }}
      >
        <h1 className="text-2xl font-bold tracking-widest">ESCALADO</h1>
      </div>

      {/* Bottom: table zone */}
      <div
        className="absolute left-0 right-0 bottom-0 bg-white pointer-events-auto"
        style={{ top: TABLE_TOP, zIndex: 20, padding: `8px ${TABLE_PADDING_X}px 16px` }}
      >
        <div className="overflow-auto">
          <table className="border-collapse text-[9px]" style={{ tableLayout: 'fixed' }}>
            <colgroup>
              {page.columns.map((c) => (
                <col key={c.id} style={{ width: getColWidth(c.id) }} />
              ))}
              {!readOnly && <col style={{ width: 24 }} />}
            </colgroup>
            <thead>
              <tr>
                {page.columns.map((col) => (
                  <th
                    key={col.id}
                    className="border border-gray-500 px-1 py-1 text-center bg-gray-100 relative select-none align-middle"
                    style={{ fontWeight: 'bold', minHeight: 38 }}
                  >
                    {readOnly ? (
                      <span className="block leading-tight break-words text-[9px]">
                        {col.label}
                      </span>
                    ) : editingHeader === col.id ? (
                      <input
                        autoFocus
                        type="text"
                        value={col.label}
                        onChange={(e) => renameColumn(col.id, e.target.value)}
                        onBlur={() => setEditingHeader(null)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === 'Escape') {
                            ;(e.target as HTMLInputElement).blur()
                          }
                        }}
                        className="w-full bg-yellow-50 outline-none text-center text-[9px] font-bold uppercase"
                      />
                    ) : (
                      <button
                        type="button"
                        onClick={() => setEditingHeader(col.id)}
                        className="block w-full leading-tight break-words text-[9px] uppercase hover:bg-gray-200"
                        title="Toca para renombrar"
                      >
                        {col.label}
                      </button>
                    )}
                    {!readOnly && (
                      <div
                        className="absolute top-0 right-0 w-2 h-full cursor-col-resize hover:bg-blue-300/50"
                        onMouseDown={(e) => handleResizeStart(e, col.id)}
                        onTouchStart={(e) => handleResizeStart(e, col.id)}
                        onClick={(e) => e.stopPropagation()}
                      />
                    )}
                  </th>
                ))}
                {!readOnly && <th className="w-6" />}
              </tr>
            </thead>
            <tbody>
              {page.rows.map((row) => (
                <tr key={row.id}>
                  {page.columns.map((col) => (
                    <td
                      key={col.id}
                      className="border border-gray-400 px-1 py-[2px] align-middle text-center"
                    >
                      {readOnly ? (
                        <span className="text-[10px]">{row.values[col.id] ?? ''}</span>
                      ) : (
                        <ScalingCell
                          value={row.values[col.id] ?? ''}
                          kind={col.kind}
                          onChange={(v) => updateCell(row.id, col.id, v)}
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

          {!readOnly && (
            <button
              onClick={addRow}
              className="mt-2 flex items-center gap-1 text-[10px] text-gray-500 hover:text-gray-800 border border-dashed border-gray-300 rounded px-2 py-1 hover:border-gray-500"
            >
              <Plus className="w-3 h-3" /> Añadir fila
            </button>
          )}
        </div>
      </div>

      {/* Header rename hint overlay — close button */}
      {!readOnly && editingHeader && (
        <div
          className="absolute pointer-events-auto"
          style={{ top: TABLE_TOP - 28, right: TABLE_PADDING_X, zIndex: 30 }}
        >
          <button
            onClick={() => setEditingHeader(null)}
            className="flex items-center gap-1 text-[10px] bg-gray-900 text-white px-2 py-1 rounded shadow"
          >
            <X className="w-3 h-3" /> Cerrar edición
          </button>
        </div>
      )}
    </>
  )
}

function ScalingCell({
  value,
  kind,
  onChange,
}: {
  value: string
  kind: 'text' | 'number'
  onChange: (v: string) => void
}) {
  if (kind === 'number') {
    return (
      <input
        type="text"
        inputMode="decimal"
        pattern="[0-9]*[.,]?[0-9]*"
        value={value}
        onChange={(e) => {
          const v = e.target.value.replace(',', '.')
          if (v === '' || /^-?\d*\.?\d*$/.test(v)) onChange(v)
        }}
        className="w-full bg-transparent outline-none text-[10px] text-center min-h-[18px]"
      />
    )
  }
  return (
    <input
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full bg-transparent outline-none text-[10px] text-center min-h-[18px]"
    />
  )
}
