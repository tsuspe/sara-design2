import { useState } from 'react'
import EditorHeader from './EditorHeader'
import PageTabs from './PageTabs'
import Toolbar from './Toolbar'
import PropertiesPanel from './PropertiesPanel'
import A4Canvas from '@/components/canvas/A4Canvas'
import PreviewModal from '@/components/PreviewModal'
import { useFichaStore } from '@/store/fichaStore'
import type { Ficha } from '@/types'
import { generateFichaThumbnailDataUrl } from '@/utils/thumbnail'
import CustomFontStyles from '@/components/CustomFontStyles'

interface EditorLayoutProps {
  onBack: (ficha?: Ficha) => Promise<void>
  onSave: (ficha?: Ficha) => Promise<void>
}

export default function EditorLayout({ onBack, onSave }: EditorLayoutProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const { currentFicha, updateFichaField } = useFichaStore()

  const buildFichaWithThumbnail = async () => {
    if (!currentFicha) return null
    try {
      const thumbnailData = generateFichaThumbnailDataUrl(currentFicha)
      const updated = {
        ...currentFicha,
        thumbnailData,
        updatedAt: new Date().toISOString(),
      }
      updateFichaField({ thumbnailData })
      return updated
    } catch (err) {
      console.warn('Thumbnail generation skipped:', err)
      return currentFicha
    }
  }

  const handleSave = async () => {
    const updated = await buildFichaWithThumbnail()
    await onSave(updated ?? undefined)
  }

  const handleBack = async () => {
    const updated = await buildFichaWithThumbnail()
    await onBack(updated ?? undefined)
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <CustomFontStyles fonts={currentFicha?.customFonts} />

      {/* Top bar */}
      <EditorHeader
        onBack={handleBack}
        onPreview={() => setPreviewOpen(true)}
        onSave={handleSave}
      />

      {/* Three-panel body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Toolbar */}
        <Toolbar />

        {/* Center: PageTabs + Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageTabs />
          <A4Canvas />
        </div>

        {/* Right: Properties */}
        <PropertiesPanel />
      </div>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  )
}
