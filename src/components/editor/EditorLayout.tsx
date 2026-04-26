import EditorHeader from './EditorHeader'
import PageTabs from './PageTabs'

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
        <div className="flex-1 bg-gray-100 flex flex-col overflow-hidden">
          <PageTabs />
          <div className="flex-1 flex items-center justify-center text-gray-400">
            Canvas
          </div>
        </div>

        {/* Right: Properties */}
        <div className="w-72 bg-white border-l flex-shrink-0 p-4 text-sm text-gray-400">
          Propiedades
        </div>
      </div>
    </div>
  )
}
