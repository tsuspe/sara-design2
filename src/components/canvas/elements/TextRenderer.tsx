import type { TextElement } from '@/types'

interface Props { element: TextElement; isSelected: boolean; onUpdate: (content: string) => void }

export default function TextRenderer({ element, isSelected, onUpdate }: Props) {
  const stopTouchForEditing = (e: React.TouchEvent) => {
    if (isSelected) e.stopPropagation()
  }

  return (
    <div
      contentEditable={isSelected}
      suppressContentEditableWarning
      onBlur={(e) => onUpdate(e.currentTarget.textContent ?? '')}
      onTouchStart={stopTouchForEditing}
      onTouchMove={stopTouchForEditing}
      className="w-full h-full outline-none break-words overflow-hidden cursor-text"
      style={{
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        color: element.color,
        textAlign: element.align,
        touchAction: isSelected ? 'auto' : 'none',
      }}
    >
      {element.content}
    </div>
  )
}
