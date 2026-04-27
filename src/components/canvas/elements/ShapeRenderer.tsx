import type { ShapeElement } from '@/types'

interface Props { element: ShapeElement; isSelected: boolean }

export default function ShapeRenderer({ element }: Props) {
  const { size, fill, stroke, strokeWidth, opacity, shape } = element
  return (
    <svg
      width={size.w}
      height={size.h}
      style={{ opacity, overflow: 'visible' }}
      className="w-full h-full"
    >
      {shape === 'rect' && (
        <rect
          x={strokeWidth / 2}
          y={strokeWidth / 2}
          width={size.w - strokeWidth}
          height={size.h - strokeWidth}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}
      {shape === 'ellipse' && (
        <ellipse
          cx={size.w / 2}
          cy={size.h / 2}
          rx={(size.w - strokeWidth) / 2}
          ry={(size.h - strokeWidth) / 2}
          fill={fill}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}
      {shape === 'line' && (
        <line
          x1={0}
          y1={size.h / 2}
          x2={size.w}
          y2={size.h / 2}
          stroke={stroke}
          strokeWidth={strokeWidth}
        />
      )}
    </svg>
  )
}
