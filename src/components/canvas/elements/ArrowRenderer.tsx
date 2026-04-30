import type { ArrowElement } from '@/types'

interface Props { element: ArrowElement; isSelected: boolean }

export default function ArrowRenderer({ element }: Props) {
  const { size, color, strokeWidth } = element
  const variant = element.variant ?? 'straight'
  const markerId = `arrow-${element.id}`
  const endX = Math.max(0, size.w - 10)
  const midY = size.h / 2
  const padding = Math.max(strokeWidth, 4)
  const path =
    variant === 'curved'
      ? `M 0 ${midY} Q ${size.w / 2} ${padding} ${endX} ${midY}`
      : variant === 'elbow'
        ? `M ${padding} ${padding} V ${midY} H ${endX}`
        : `M 0 ${midY} H ${endX}`

  return (
    <svg
      width={size.w}
      height={size.h}
      style={{ overflow: 'visible' }}
      className="w-full h-full"
    >
      <defs>
        <marker id={markerId} markerWidth="6" markerHeight="6" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" fill={color} />
        </marker>
      </defs>
      <path
        d={path}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        markerEnd={`url(#${markerId})`}
      />
    </svg>
  )
}
