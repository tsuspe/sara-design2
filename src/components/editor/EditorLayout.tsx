import { useState } from 'react'
import EditorHeader from './EditorHeader'
import PageTabs from './PageTabs'
import Toolbar from './Toolbar'
import PropertiesPanel from './PropertiesPanel'
import A4Canvas from '@/components/canvas/A4Canvas'
import PreviewModal from '@/components/PreviewModal'
import { useExport } from '@/hooks/useExport'
import { useFichaStore } from '@/store/fichaStore'

interface EditorLayoutProps {
  onBack: () => void
  onSave: () => Promise<void>
}

export default function EditorLayout({ onBack, onSave }: EditorLayoutProps) {
  const [previewOpen, setPreviewOpen] = useState(false)
  const { generateThumbnail, pageRefs } = useExport()
  const { updateFichaField } = useFichaStore()

  const handleSave = async () => {
    try {
      const thumbnailData = await generateThumbnail()
      updateFichaField({ thumbnailData })
    } catch (err) {
      // Thumbnail generation can fail if no elements on page 0 — just skip
      console.warn('Thumbnail generation skipped:', err)
    }
    await onSave()
  }

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <EditorHeader
        onBack={onBack}
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
          <A4Canvas pageRef={{ current: pageRefs.current[0] } as React.RefObject<HTMLDivElement | null>} />
        </div>

        {/* Right: Properties */}
        <PropertiesPanel />
      </div>

      <PreviewModal open={previewOpen} onClose={() => setPreviewOpen(false)} />
    </div>
  )
}
