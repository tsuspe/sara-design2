import type { TextElement } from '@/types'

interface Props { element: TextElement; isSelected: boolean; onUpdate: (content: string) => void }

export default function TextRenderer({ element, isSelected, onUpdate }: Props) {
  return (
    <div
      contentEditable={isSelected}
      suppressContentEditableWarning
      onBlur={(e) => onUpdate(e.currentTarget.textContent ?? '')}
      className="w-full h-full outline-none break-words overflow-hidden cursor-text"
      style={{
        fontSize: element.fontSize,
        fontFamily: element.fontFamily,
        fontWeight: element.fontWeight,
        fontStyle: element.fontStyle,
        color: element.color,
        textAlign: element.align,
      }}
    >
      {element.content}
    </div>
  )
}
