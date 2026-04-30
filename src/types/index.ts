// ─── Canvas Elements ──────────────────────────────────────────────────────────

export type CanvasElementType = 'image' | 'text' | 'label' | 'arrow' | 'shape'

export interface BaseCanvasElement {
  id: string
  type: CanvasElementType
  position: { x: number; y: number }
  size: { w: number; h: number }
  rotation: number
  zIndex: number
  visible: boolean
}

export interface ImageElement extends BaseCanvasElement {
  type: 'image'
  src: string        // base64 data URL
  opacity: number    // 0-1
}

export interface TextElement extends BaseCanvasElement {
  type: 'text'
  content: string
  fontSize: number
  fontFamily: string
  fontWeight: 'normal' | 'bold'
  fontStyle: 'normal' | 'italic'
  color: string
  align: 'left' | 'center' | 'right'
}

export interface LabelElement extends BaseCanvasElement {
  type: 'label'
  content: string
  fontSize: number
  fontFamily?: string
  fontWeight?: 'normal' | 'bold'
  fontStyle?: 'normal' | 'italic'
  align?: 'left' | 'center' | 'right'
  color: string
  backgroundColor: string
}

export interface ArrowElement extends BaseCanvasElement {
  type: 'arrow'
  variant?: 'straight' | 'curved' | 'elbow'
  color: string
  strokeWidth: number
}

export interface ShapeElement extends BaseCanvasElement {
  type: 'shape'
  shape: 'rect' | 'ellipse' | 'line' | 'triangle' | 'diamond'
  fill: string
  stroke: string
  strokeWidth: number
  opacity: number
}

export type CanvasElement =
  | ImageElement
  | TextElement
  | LabelElement
  | ArrowElement
  | ShapeElement

export interface CustomFont {
  id: string
  name: string
  family: string
  dataUrl: string
  format: 'truetype' | 'opentype' | 'woff' | 'woff2'
}

// ─── Measurements ─────────────────────────────────────────────────────────────

export interface Measurement {
  id: string
  label: string  // e.g. "Talla", "Busto", "Cintura", "Cadera", "Largo total"
  value: string  // e.g. "M", "92cm", "76cm"
}

// ─── Pattern Pieces ───────────────────────────────────────────────────────────

export interface PatternPiece {
  id: string
  letterRef: string   // A, B, C… — used for auto-sorted summary table
  name: string
  fabric?: string
  quantity: number
  notes?: string
}

// ─── Pages ────────────────────────────────────────────────────────────────────

export interface Page1Visual {
  type: 'visual'
  elements: CanvasElement[]
  showAnnotations: boolean   // when false, hides 'arrow' and 'label' elements
}

export interface Page2Graphic {
  type: 'graphic'
  elements: CanvasElement[]
  pageTitle: string          // independent of Ficha.title; defaults to modelName
  colorPalette: string[]     // array of hex colors
}

export interface Page3Technical {
  type: 'technical'
  elements: CanvasElement[]
  garmentThumbnailData?: string  // base64 PNG uploaded via click zone
  patternPieces: PatternPiece[]
  measurements: Measurement[]
}

export type FichaPage = Page1Visual | Page2Graphic | Page3Technical

// ─── Ficha ────────────────────────────────────────────────────────────────────

export interface Ficha {
  id: string
  fichaNumber: string
  title: string
  modelName: string
  printTechnique: string
  gsm: string
  emissionDate: string   // ISO date string
  receptionDate: string  // ISO date string
  tallerName: string
  approvedPrototype: boolean | null
  modifications: string
  designerName: string
  brand: string
  season: string
  fabric: string       // material / tela base
  size: string         // talla base
  description: string  // descripción del artículo
  article: string      // artículo / código
  line: string         // línea / colección
  titleFontFamily?: string
  titleFontSize?: number
  titleFontWeight?: 'normal' | 'bold'
  titleFontStyle?: 'normal' | 'italic'
  bodyFontFamily?: string
  customFonts?: CustomFont[]
  pages: [Page1Visual, Page2Graphic, Page3Technical]
  createdAt: string      // ISO datetime string
  updatedAt: string      // ISO datetime string
  thumbnailData?: string // base64 PNG of page 1 at 0.25x scale
}

// ─── Editor State ─────────────────────────────────────────────────────────────

export type PageIndex = 0 | 1 | 2

export interface CanvasSelection {
  elementId: string | null
}
