export interface PespunteGraphic {
  key: string
  label: string
  src: string
}

export const PESPUNTES_CATALOG: PespunteGraphic[] = [
  { key: 'pespunte', label: 'Pespunte', src: '/graphics/pespuntes/pespunte.png' },
  { key: 'doble-pespunte', label: 'Doble pespunte', src: '/graphics/pespuntes/doble-pespunte.png' },
  { key: 'owerlock', label: 'Owerlock', src: '/graphics/pespuntes/owerlock.png' },
  { key: 'owerlock-5hilos', label: 'Owerlock 5 hilos', src: '/graphics/pespuntes/owerlock-5hilos.png' },
  { key: 'recubridora', label: 'Recubridora', src: '/graphics/pespuntes/recubridora.png' },
  { key: 'cordoncillo', label: 'Cordoncillo', src: '/graphics/pespuntes/cordoncillo.png' },
  { key: 'cremallera', label: 'Cremallera', src: '/graphics/pespuntes/cremallera.png' },
  { key: 'vivo-entrehojado', label: 'Vivo entrehojado', src: '/graphics/pespuntes/vivo-entrehojado.png' },
  { key: 'bies', label: 'Bies', src: '/graphics/pespuntes/bies.png' },
  { key: 'ojal', label: 'Ojal', src: '/graphics/pespuntes/ojal.png' },
  { key: 'boton', label: 'Botón', src: '/graphics/pespuntes/boton.png' },
  { key: 'costura-plana-abierta', label: 'Costura plana (abierta)', src: '/graphics/pespuntes/costura-plana-abierta.png' },
  { key: 'costura-plana-abierta-alt', label: 'Costura plana (abierta) alt.', src: '/graphics/pespuntes/costura-plana-abierta-alt.png' },
  { key: 'costura-plana-owerlockada', label: 'Costura plana owerlockada', src: '/graphics/pespuntes/costura-plana-owerlockada.png' },
  { key: 'costura-cerrada', label: 'Costura cerrada', src: '/graphics/pespuntes/costura-cerrada.png' },
  { key: 'costura-francesa', label: 'Costura francesa', src: '/graphics/pespuntes/costura-francesa.png' },
  { key: 'costura-rebatida', label: 'Costura rebatida', src: '/graphics/pespuntes/costura-rebatida.png' },
  { key: 'costura-plana-cargada-1', label: 'Costura plana cargada 1', src: '/graphics/pespuntes/costura-plana-cargada-1.png' },
  { key: 'costura-plana-cargada-2', label: 'Costura plana cargada 2', src: '/graphics/pespuntes/costura-plana-cargada-2.png' },
  { key: 'costura-plana-ow-cargada-0', label: 'Costura plana ow. cargada (sin)', src: '/graphics/pespuntes/costura-plana-ow-cargada-0.png' },
  { key: 'costura-plana-ow-cargada-1', label: 'Costura plana ow. cargada 1', src: '/graphics/pespuntes/costura-plana-ow-cargada-1.png' },
  { key: 'costura-plana-ow-cargada-2', label: 'Costura plana ow. cargada 2', src: '/graphics/pespuntes/costura-plana-ow-cargada-2.png' },
  { key: 'costura-cargada-lateral-1', label: 'Costura cargada lateral 1', src: '/graphics/pespuntes/costura-cargada-lateral-1.png' },
  { key: 'costura-cargada-lateral-2', label: 'Costura cargada lateral 2', src: '/graphics/pespuntes/costura-cargada-lateral-2.png' },
  { key: 'costura-cerrada-lateral-1', label: 'Costura cerrada lateral 1', src: '/graphics/pespuntes/costura-cerrada-lateral-1.png' },
  { key: 'costura-cerrada-lateral-2', label: 'Costura cerrada lateral 2', src: '/graphics/pespuntes/costura-cerrada-lateral-2.png' },
  { key: 'plancha', label: 'Plancha', src: '/graphics/pespuntes/plancha.png' },
]

export function getPespunteBySrc(key: string): PespunteGraphic | undefined {
  return PESPUNTES_CATALOG.find((p) => p.key === key)
}
