import { useParams, useNavigate } from 'react-router-dom'
import { useFicha } from '@/hooks/useFicha'
import EditorLayout from '@/components/editor/EditorLayout'

export default function Editor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { currentFicha, scheduleSave } = useFicha(id!)

  if (!currentFicha) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-400">Cargando ficha...</p>
      </div>
    )
  }

  const handleBack = async () => {
    await scheduleSave()
    navigate('/')
  }

  return <EditorLayout onBack={handleBack} />
}
