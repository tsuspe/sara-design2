import { v4 as uuidv4 } from 'uuid'
import type { Ficha, Page1Visual, Page2Graphic, Page3Technical, Page4Phases, ColumnStyle } from '@/types'

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
      cod: { ...DEFAULT_COLUMN_STYLE },
      fase: { ...DEFAULT_COLUMN_STYLE },
      descripcion: { ...DEFAULT_COLUMN_STYLE },
      maquina: { ...DEFAULT_COLUMN_STYLE },
      grafico: { ...DEFAULT_COLUMN_STYLE },
      observaciones: { ...DEFAULT_COLUMN_STYLE },
    },
    columnWidths: {
      cod: 50,
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
    pages: [createDefaultPage1(), createDefaultPage2(), createDefaultPage3(), createDefaultPage4()],
    createdAt: now,
    updatedAt: now,
    thumbnailData: undefined,
  }
}
