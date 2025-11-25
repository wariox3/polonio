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
    link: '/verificacion',
    iconoClase: 'ki-filled ki-home',
    activo: false,
  },
];
