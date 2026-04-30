import type { LabelElement } from '@/types'

interface Props { element: LabelElement; isSelected: boolean }

export default function LabelRenderer({ element, isSelected }: Props) {
  return (
    <div
      className="w-full h-full flex items-center px-2 overflow-hidden"
      style={{
        fontSize: element.fontSize,
        fontFamily: element.fontFamily ?? 'Arial, sans-serif',
        fontWeight: element.fontWeight ?? 'normal',
        fontStyle: element.fontStyle ?? 'normal',
        color: element.color,
        backgroundColor: element.backgroundColor,
        border: isSelected ? '1px solid #3b82f6' : '1px solid #d1d5db',
        borderRadius: 4,
        justifyContent:
          element.align === 'center' ? 'center' : element.align === 'right' ? 'flex-end' : 'flex-start',
      }}
    >
      <span className="truncate">{element.content}</span>
    </div>
  )
}
