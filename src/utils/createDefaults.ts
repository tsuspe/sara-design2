import { v4 as uuidv4 } from 'uuid'
import type { Ficha, Page1Visual, Page2Graphic, Page3Technical, Page4Scaling, Page4Phases, ColumnStyle, ScalingColumn } from '@/types'

export function createDefaultPage1(): Page1Visual {
  return {
    type: 'visual',
    elements: [],
    showAnnotations: true,
  }
}

export function createDefaultPage2(modelName = ''): Page2Graphic {
  return {
    type: 'graphic',
    elements: [],
    pageTitle: modelName,
    colorPalette: ['#000000', '#ffffff', '#cccccc'],
  }
}

export function createDefaultPage3(): Page3Technical {
  return {
    type: 'technical',
    elements: [],
    garmentThumbnailData: undefined,
    patternPieces: [],
    measurements: [
      { id: uuidv4(), label: 'Talla', value: '' },
      { id: uuidv4(), label: 'Busto', value: '' },
      { id: uuidv4(), label: 'Cintura', value: '' },
      { id: uuidv4(), label: 'Cadera', value: '' },
      { id: uuidv4(), label: 'Largo total', value: '' },
    ],
  }
}

const DEFAULT_SCALING_COLUMNS: ScalingColumn[] = [
  { id: 'medidas', label: 'MEDIDAS', kind: 'text' },
  { id: 'letra', label: 'LETRA', kind: 'text' },
  { id: 'xs', label: 'XS', kind: 'number' },
  { id: 's', label: 'S', kind: 'number' },
  { id: 'm', label: 'M', kind: 'number' },
  { id: 'l', label: 'L', kind: 'number' },
  { id: 'patron-completo', label: 'PATRÓN COMPLETO CONTORNOS COMPLETOS', kind: 'number' },
  { id: 'prototipo', label: 'PROTOTIPO O FLECHAS DIBUJO', kind: 'number' },
  { id: 'cuarto-patron', label: '1/4 PATRÓN O COMO SE PATRONA EN MESA', kind: 'number' },
]

const DEFAULT_SCALING_WIDTHS: Record<string, number> = {
  medidas: 95,
  letra: 38,
  xs: 38,
  s: 38,
  m: 38,
  l: 38,
  'patron-completo': 105,
  prototipo: 95,
  'cuarto-patron': 105,
}

export function createDefaultPage4Scaling(): Page4Scaling {
  return {
    type: 'scaling',
    elements: [],
    columns: DEFAULT_SCALING_COLUMNS.map((c) => ({ ...c })),
    rows: [],
    columnWidths: { ...DEFAULT_SCALING_WIDTHS },
  }
}

const DEFAULT_COLUMN_STYLE: ColumnStyle = {
  backgroundColor: '#f3f4f6',
  textColor: '#111827',
  fontFamily: 'Arial, sans-serif',
  fontWeight: 'bold',
  fontStyle: 'normal',
}

export function createDefaultPage4(): Page4Phases {
  return {
    type: 'phases',
    garmentName: '',
    responsibleName: '',
    phases: [],
    columnStyles: {
      fase: { ...DEFAULT_COLUMN_STYLE },
      descripcion: { ...DEFAULT_COLUMN_STYLE },
      maquina: { ...DEFAULT_COLUMN_STYLE },
      grafico: { ...DEFAULT_COLUMN_STYLE },
      observaciones: { ...DEFAULT_COLUMN_STYLE },
    },
    columnWidths: {
      fase: 45,
      descripcion: 230,
      maquina: 90,
      grafico: 140,
      observaciones: 140,
    },
  }
}

export function createDefaultFicha(): Ficha {
  const now = new Date().toISOString()
  return {
    id: uuidv4(),
    fichaNumber: '',
    title: 'Nueva ficha',
    modelName: '',
    printTechnique: '',
    gsm: '',
    emissionDate: '',
    receptionDate: '',
    tallerName: '',
    approvedPrototype: null,
    modifications: '',
    designerName: '',
    brand: '',
    season: '',
    fabric: '',
    size: '',
    description: '',
    article: '',
    line: '',
    titleFontFamily: 'Arial, sans-serif',
    titleFontSize: 46,
    titleFontWeight: 'bold',
    titleFontStyle: 'normal',
    bodyFontFamily: 'Arial, sans-serif',
    customFonts: [],
    pages: [createDefaultPage1(), createDefaultPage2(), createDefaultPage3(), createDefaultPage4Scaling(), createDefaultPage4()],
    createdAt: now,
    updatedAt: now,
    thumbnailData: undefined,
  }
}
