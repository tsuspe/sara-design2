import EditorHeader from './EditorHeader'
import PageTabs from './PageTabs'
import Toolbar from './Toolbar'
import PropertiesPanel from './PropertiesPanel'
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
        <Toolbar />

        {/* Center: PageTabs + Canvas */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <PageTabs />
          <A4Canvas />
        </div>

        {/* Right: Properties */}
        <PropertiesPanel />
      </div>
    </div>
  )
}
