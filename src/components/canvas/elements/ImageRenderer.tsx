import type { ImageElement } from '@/types'

interface Props { element: ImageElement; isSelected: boolean }

export default function ImageRenderer({ element }: Props) {
  return (
    <div
      className="w-full h-full overflow-hidden"
      style={{ opacity: element.opacity }}
    >
      {element.src ? (
        <img
          src={element.src}
          alt=""
          className="w-full h-full object-contain select-none"
          draggable={false}
        />
      ) : (
        <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400 text-xs">
          Sin imagen
        </div>
      )}
    </div>
  )
}
