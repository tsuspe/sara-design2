import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useFichaStore } from '@/store/fichaStore'
import type { PageIndex } from '@/types'

const PAGE_LABELS: Record<PageIndex, string> = {
  0: 'Página 1 — Visual',
  1: 'Página 2 — Gráfico',
  2: 'Página 3 — Técnico',
}

export default function PageTabs() {
  const { currentPageIndex, setCurrentPageIndex } = useFichaStore()

  return (
    <Tabs
      value={currentPageIndex}
      onValueChange={(val) => setCurrentPageIndex(val as PageIndex)}
      className="px-4 pt-2 bg-gray-50 border-b"
    >
      <TabsList>
        {([0, 1, 2] as PageIndex[]).map((idx) => (
          <TabsTrigger key={idx} value={idx}>
            {PAGE_LABELS[idx]}
          </TabsTrigger>
        ))}
      </TabsList>
    </Tabs>
  )
}
