import { Scissors, MoreVertical } from 'lucide-react'
import type { Ficha } from '@/types'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

interface FichaCardProps {
  ficha: Ficha
  onOpen: () => void
  onDelete: (e: React.MouseEvent) => void
}

function formatRelativeDate(isoString: string): string {
  const diff = Date.now() - new Date(isoString).getTime()
  const days = Math.floor(diff / 86400000)
  if (days === 0) return 'Hoy'
  if (days === 1) return 'Ayer'
  if (days < 7) return `Hace ${days} días`
  if (days < 30) return `Hace ${Math.floor(days / 7)} semanas`
  return `Hace ${Math.floor(days / 30)} meses`
}

export default function FichaCard({ ficha, onOpen, onDelete }: FichaCardProps) {
  return (
    <div
      className="bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-gray-200 transition-all cursor-pointer flex flex-col overflow-hidden"
      onClick={onOpen}
    >
      {/* Thumbnail */}
      <div className="relative w-full aspect-[3/4] bg-gray-100 flex items-center justify-center overflow-hidden">
        {ficha.thumbnailData ? (
          <img
            src={ficha.thumbnailData}
            alt={ficha.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <Scissors className="w-10 h-10 text-gray-300" />
        )}

        {/* Kebab menu — stop propagation so card click doesn't fire */}
        <div
          className="absolute top-2 right-2"
          onClick={(e) => e.stopPropagation()}
        >
          <DropdownMenu>
            <DropdownMenuTrigger
              className="inline-flex items-center justify-center h-7 w-7 rounded-md bg-white/80 hover:bg-white shadow-sm text-gray-700"
            >
              <MoreVertical className="h-4 w-4" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                className="text-red-600 focus:text-red-600 focus:bg-red-50"
                onClick={onDelete}
              >
                Eliminar
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Card body */}
      <div className="p-3 flex flex-col gap-0.5">
        {ficha.fichaNumber && (
          <span className="text-xs text-gray-400 font-mono">#{ficha.fichaNumber}</span>
        )}
        <p className="text-sm font-semibold text-gray-900 truncate leading-tight">
          {ficha.title}
        </p>
        {ficha.modelName && (
          <p className="text-xs text-gray-500 truncate">{ficha.modelName}</p>
        )}
        <p className="text-xs text-gray-400 mt-1">{formatRelativeDate(ficha.updatedAt)}</p>
      </div>
    </div>
  )
}
