import { Rnd } from 'react-rnd'
import type { CanvasElement } from '@/types'
import ImageRenderer from './elements/ImageRenderer'
import TextRenderer from './elements/TextRenderer'
import LabelRenderer from './elements/LabelRenderer'
import ArrowRenderer from './elements/ArrowRenderer'
import ShapeRenderer from './elements/ShapeRenderer'

interface Props {
  element: CanvasElement
  isSelected: boolean
  onSelect: () => void
  onUpdate: (changes: Partial<CanvasElement>) => void
}

export default function CanvasElementWrapper({
  element,
  isSelected,
  onSelect,
  onUpdate,
}: Props) {
  const { position, size, rotation, visible, zIndex } = element

  if (!visible) return null

  const handleDragStop = (_: unknown, d: { x: number; y: number }) => {
    onUpdate({ position: { x: d.x, y: d.y } })
  }

  const handleResizeStop = (
    _: unknown,
    __: unknown,
    ref: HTMLElement,
    ___: unknown,
    pos: { x: number; y: number }
  ) => {
    onUpdate({
      size: { w: ref.offsetWidth, h: ref.offsetHeight },
      position: { x: pos.x, y: pos.y },
    })
  }

  const renderContent = () => {
    switch (element.type) {
      case 'image':
        return <ImageRenderer element={element} isSelected={isSelected} />
      case 'text':
        return (
          <TextRenderer
            element={element}
            isSelected={isSelected}
            onUpdate={(content) => onUpdate({ content } as Partial<CanvasElement>)}
          />
        )
      case 'label':
        return <LabelRenderer element={element} isSelected={isSelected} />
      case 'arrow':
        return <ArrowRenderer element={element} isSelected={isSelected} />
      case 'shape':
        return <ShapeRenderer element={element} isSelected={isSelected} />
    }
  }

  return (
    <Rnd
      position={{ x: position.x, y: position.y }}
      size={{ width: size.w, height: size.h }}
      onDragStop={handleDragStop}
      onResizeStop={handleResizeStop}
      onMouseDown={onSelect}
      style={{
        zIndex: zIndex + 100,
      }}
      bounds="parent"
      enableResizing={isSelected}
    >
      <div
        className="w-full h-full"
        style={{
          transform: `rotate(${rotation}deg)`,
          transformOrigin: 'center center',
          outline: isSelected ? '2px solid #3b82f6' : 'none',
          outlineOffset: '1px',
        }}
      >
        {renderContent()}
      </div>
    </Rnd>
  )
}
