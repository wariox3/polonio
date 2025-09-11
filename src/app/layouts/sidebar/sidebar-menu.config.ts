export interface SidebarMenuItem {
  nombre: string;
  link: string;
  iconoClase?: string;
  activo?: boolean;
  tipoAcordion?: boolean;
  abierto?: boolean;
  children?: SidebarMenuItem[];
}

export const SIDEBAR_MENU: SidebarMenuItem[] = [
  {
    nombre: 'Inicio',
    link: '/dashboard',
    iconoClase: 'ki-filled ki-home',
    activo: false,
  },
  {
    nombre: 'Viaje',
    link: '/viaje',
    iconoClase: 'ki-filled ki-delivery',
    activo: false,
  },
  {
    nombre: 'Movimiento',
    link: '/movimiento',
    iconoClase: 'ki-filled ki-abstract-26',
    activo: false,
    tipoAcordion: true,
    abierto: false,
    children: [
      { nombre: 'Negocio', link: '/movimiento/negocio/lista' },
      { nombre: 'Guía', link: '/movimiento/guia/lista' },
      { nombre: 'Despacho', link: '/movimiento/despacho/lista' },
    ],
  },
  {
    nombre: 'Administrador',
    link: '/administracion',
    iconoClase: 'ki-filled ki-setting-2',
    activo: false,
    tipoAcordion: true,
    abierto: false,
    children: [
      { nombre: 'Vehículo', link: '/administracion/vehiculo/lista' },
      { nombre: 'Conductor', link: '/administracion/conductor/lista' },
      { nombre: 'Operación', link: '/administracion/operacion/lista' },
      { nombre: 'Ruta', link: '/administracion/ruta/lista' },
    ],
  },
  {
    nombre: 'Utilidad',
    link: '/utilidad',
    iconoClase: 'ki-filled ki-abstract-26',
    activo: false,
    tipoAcordion: true,
    abierto: false,
    children: [{ nombre: 'Rndc', link: '/utilidad/rndc/lista' }],
  },
  {
    nombre: 'Informe',
    link: '/informe',
    iconoClase: 'ki-filled ki-tablet-text-down',
    activo: false,
    tipoAcordion: true,
    abierto: false,
    children: [
      { nombre: 'Pendiente despacho', link: '/informe/pendiente_despacho' },
      { nombre: 'Pendiente entrega', link: '/informe/pendiente_entrega' },
    ],
  },
  {
    nombre: 'Proceso',
    link: '/proceso',
    iconoClase: 'ki-filled ki-book',
    activo: false,
    tipoAcordion: true,
    abierto: false,
    children: [{ nombre: 'Entrega guia', link: '/proceso/entrega_guia' }],
  },
];
