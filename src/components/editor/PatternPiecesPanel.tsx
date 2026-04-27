import { v4 as uuidv4 } from 'uuid'
import type { PatternPiece, Page3Technical, Measurement } from '@/types'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

function nextLetterRef(existing: PatternPiece[]): string {
  const used = new Set(existing.map((p) => p.letterRef.toUpperCase()))
  for (let i = 0; i < 26; i++) {
    const letter = String.fromCharCode(65 + i) // A-Z
    if (!used.has(letter)) return letter
  }
  return `P${existing.length + 1}` // fallback
}

interface PatternPiecesPanelProps {
  page: Page3Technical
  onUpdatePieces: (pieces: PatternPiece[]) => void
  onUpdateMeasurements: (measurements: Measurement[]) => void
}

export default function PatternPiecesPanel({ page, onUpdatePieces, onUpdateMeasurements }: PatternPiecesPanelProps) {
  const pieces = page.patternPieces
  const measurements = page.measurements ?? []

  // ── Measurements handlers ──────────────────────────────────────────────────

  const handleAddMeasurement = () => {
    onUpdateMeasurements([
      ...measurements,
      { id: uuidv4(), label: 'Nueva medida', value: '' },
    ])
  }

  const handleUpdateMeasurement = (id: string, changes: Partial<Measurement>) => {
    onUpdateMeasurements(measurements.map((m) => (m.id === id ? { ...m, ...changes } : m)))
  }

  const handleDeleteMeasurement = (id: string) => {
    onUpdateMeasurements(measurements.filter((m) => m.id !== id))
  }

  // ── Pattern piece handlers ─────────────────────────────────────────────────

  const handleAdd = () => {
    const newPiece: PatternPiece = {
      id: uuidv4(),
      letterRef: nextLetterRef(pieces),
      name: '',
      fabric: '',
      quantity: 1,
      notes: '',
    }
    onUpdatePieces([...pieces, newPiece])
  }

  const handleUpdate = (id: string, changes: Partial<PatternPiece>) => {
    onUpdatePieces(pieces.map((p) => (p.id === id ? { ...p, ...changes } : p)))
  }

  const handleDelete = (id: string) => {
    onUpdatePieces(pieces.filter((p) => p.id !== id))
  }

  return (
    <>
      {/* ── MEASUREMENTS SECTION ── */}
      <div className="flex flex-col gap-3 p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Tabla de medidas
          </p>
          <button
            type="button"
            onClick={handleAddMeasurement}
            className="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
          >
            + Añadir medida
          </button>
        </div>

        {measurements.length === 0 && (
          <p className="text-xs text-gray-400 italic">Sin medidas. Pulsa &ldquo;Añadir medida&rdquo;.</p>
        )}

        <div className="flex flex-col gap-2">
          {measurements.map((m) => (
            <div key={m.id} className="flex items-center gap-2">
              <div className="flex flex-col gap-0.5 flex-1">
                <Label className="text-xs">Medida</Label>
                <Input
                  value={m.label}
                  placeholder="Ej. Busto"
                  onChange={(e) => handleUpdateMeasurement(m.id, { label: e.target.value })}
                  className="h-6 text-xs"
                />
              </div>
              <div className="flex flex-col gap-0.5 w-20">
                <Label className="text-xs">Valor</Label>
                <Input
                  value={m.value}
                  placeholder="Ej. 92cm"
                  onChange={(e) => handleUpdateMeasurement(m.id, { value: e.target.value })}
                  className="h-6 text-xs"
                />
              </div>
              <button
                type="button"
                onClick={() => handleDeleteMeasurement(m.id)}
                className="mt-4 w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-bold shrink-0"
                title="Eliminar medida"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* ── PATTERN PIECES SECTION ── */}
      <div className="flex flex-col gap-3 p-3 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
            Piezas de patron
          </p>
          <button
            type="button"
            onClick={handleAdd}
            className="text-xs bg-gray-800 text-white px-2 py-1 rounded hover:bg-gray-700 transition-colors"
          >
            + Anadir pieza
          </button>
        </div>

        {pieces.length === 0 && (
          <p className="text-xs text-gray-400 italic">Sin piezas aun. Pulsa &ldquo;Anadir pieza&rdquo;.</p>
        )}

        <div className="flex flex-col gap-3">
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className="border border-gray-200 rounded p-2 flex flex-col gap-2 bg-gray-50"
            >
              {/* Header row: letterRef + delete */}
              <div className="flex items-center gap-2">
                <div className="flex flex-col gap-0.5 w-12">
                  <Label className="text-xs">Ref</Label>
                  <Input
                    value={piece.letterRef}
                    maxLength={2}
                    onChange={(e) =>
                      handleUpdate(piece.id, { letterRef: e.target.value.toUpperCase() })
                    }
                    className="h-6 text-xs text-center font-mono font-bold"
                  />
                </div>
                <div className="flex flex-col gap-0.5 flex-1">
                  <Label className="text-xs">Nombre</Label>
                  <Input
                    value={piece.name}
                    placeholder="Nombre de la pieza"
                    onChange={(e) => handleUpdate(piece.id, { name: e.target.value })}
                    className="h-6 text-xs"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleDelete(piece.id)}
                  className="mt-4 w-6 h-6 flex items-center justify-center text-red-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors text-sm font-bold shrink-0"
                  title="Eliminar pieza"
                >
                  ×
                </button>
              </div>

              {/* Second row: fabric + quantity */}
              <div className="flex gap-2">
                <div className="flex flex-col gap-0.5 flex-1">
                  <Label className="text-xs">Tela</Label>
                  <Input
                    value={piece.fabric ?? ''}
                    placeholder="Tela (opcional)"
                    onChange={(e) => handleUpdate(piece.id, { fabric: e.target.value })}
                    className="h-6 text-xs"
                  />
                </div>
                <div className="flex flex-col gap-0.5 w-16">
                  <Label className="text-xs">Cantidad</Label>
                  <Input
                    type="number"
                    min={1}
                    value={piece.quantity}
                    onChange={(e) =>
                      handleUpdate(piece.id, { quantity: Math.max(1, Number(e.target.value)) })
                    }
                    className="h-6 text-xs text-center"
                  />
                </div>
              </div>

              {/* Notes */}
              <div className="flex flex-col gap-0.5">
                <Label className="text-xs">Notas</Label>
                <textarea
                  value={piece.notes ?? ''}
                  placeholder="Notas (opcional)"
                  onChange={(e) => handleUpdate(piece.id, { notes: e.target.value })}
                  rows={2}
                  className="text-xs border rounded px-2 py-1 resize-none w-full"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
