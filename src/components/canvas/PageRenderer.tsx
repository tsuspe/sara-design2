import type { FichaPage } from '@/types'
import ImageRenderer from './elements/ImageRenderer'
import TextRenderer from './elements/TextRenderer'
import LabelRenderer from './elements/LabelRenderer'
import ArrowRenderer from './elements/ArrowRenderer'
import ShapeRenderer from './elements/ShapeRenderer'
import type { ImageElement, TextElement, LabelElement, ArrowElement, ShapeElement } from '@/types'

interface Props {
  page: FichaPage
  showAnnotations?: boolean  // if false, hide 'arrow' and 'label' elements
}

export default function PageRenderer({ page, showAnnotations = true }: Props) {
  const visibleElements = page.elements
    .filter((el) => el.visible)
    .filter((el) => showAnnotations || (el.type !== 'arrow' && el.type !== 'label'))
    .sort((a, b) => a.zIndex - b.zIndex)

  return (
    <>
      {visibleElements.map((element) => {
        const style: React.CSSProperties = {
          position: 'absolute',
          left: element.position.x,
          top: element.position.y,
          width: element.size.w,
          height: element.size.h,
          transform: `rotate(${element.rotation}deg)`,
          zIndex: element.zIndex,
        }
        return (
          <div key={element.id} style={style}>
            {element.type === 'image' && (
              <ImageRenderer element={element as ImageElement} isSelected={false} />
            )}
            {element.type === 'text' && (
              <TextRenderer
                element={element as TextElement}
                isSelected={false}
                onUpdate={() => {}}
              />
            )}
            {element.type === 'label' && (
              <LabelRenderer element={element as LabelElement} isSelected={false} />
            )}
            {element.type === 'arrow' && (
              <ArrowRenderer element={element as ArrowElement} isSelected={false} />
            )}
            {element.type === 'shape' && (
              <ShapeRenderer element={element as ShapeElement} isSelected={false} />
            )}
          </div>
        )
      })}
    </>
  )
}
