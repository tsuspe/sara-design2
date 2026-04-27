import type { ArrowElement } from '@/types'

interface Props { element: ArrowElement; isSelected: boolean }

export default function ArrowRenderer({ element }: Props) {
  const { size, color, strokeWidth } = element
  return (
    <svg
      width={size.w}
      height={size.h}
      style={{ overflow: 'visible' }}
      className="w-full h-full"
    >
      <defs>
        <marker id={`arrow-${element.id}`} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
      <line
        x1={0}
        y1={size.h / 2}
        x2={size.w - 10}
        y2={size.h / 2}
        stroke={color}
        strokeWidth={strokeWidth}
        markerEnd={`url(#arrow-${element.id})`}
      />
    </svg>
  )
}
