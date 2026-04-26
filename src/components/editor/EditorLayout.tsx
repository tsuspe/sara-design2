import EditorHeader from './EditorHeader'
import PageTabs from './PageTabs'
import A4Canvas from '@/components/canvas/A4Canvas'

interface EditorLayoutProps {
  onBack: () => void
}

export default function EditorLayout({ onBack }: EditorLayoutProps) {
  return (
    <div className="flex flex-col h-screen overflow-hidden">
      {/* Top bar */}
      <EditorHeader onBack={onBack} />

      {/* Three-panel body */}
      <div className="flex flex-1 overflow-hidden">
        {/* Left: Toolbar */}
        <div className="w-64 bg-white border-r flex-shrink-0 p-4 text-sm text-gray-400">
          Toolbar
        </div>

        {/* Center: PageTabs + Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageTabs />
          <A4Canvas />
        </div>

        {/* Right: Properties */}
        <div className="w-72 bg-white border-l flex-shrink-0 p-4 text-sm text-gray-400">
          Propiedades
        </div>
      </div>
    </div>
  )
}
