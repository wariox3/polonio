import { Component, HostBinding } from '@angular/core';
import { RouterLink } from '@angular/router';
import { RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  @HostBinding('class') hostClass =
    'sidebar h-100 dark:bg-coal-600 bg-light border-r border-r-gray-200 dark:border-r-coal-100 fixed z-20 lg:flex flex-col items-stretch shrink-0';
  @HostBinding('style') style = { height: '100% !important' };
  @HostBinding('attr.data-drawer') drawer = 'true';
  @HostBinding('attr.data-drawer-class') drawerClass = 'drawer drawer-start top-0 bottom-0';
  @HostBinding('attr.data-drawer-enable') drawerEnable = 'true|lg:false';
  @HostBinding('attr.id') id = 'sidebar';

  public sidebarMenu: any[] = [
    {
      nombre: 'Inicio',
      link: '/dashboard',
      iconoClase: 'ki-filled ki-home',
      activo: false,
    },
    {
      nombre: 'Movimiento',
      link: '/movimiento',
      iconoClase: 'ki-filled ki-abstract-26',
      activo: false,
      tipoAcordion: true,
      abierto: true,
      children: [
        {
          nombre: 'Guía',
          link: '/movimiento/guia/lista',
        },
      ],
    },
    {
      nombre: 'Administrador',
      link: '/administracion',
      iconoClase: 'ki-filled ki-setting-2',
      activo: false,
      tipoAcordion: true,
      children: [
        {
          nombre: 'Vehiculo',
          link: '/administracion/vehiculo/lista',
        },
        {
          nombre: 'Conductor',
          link: '/administracion/conductor/lista',
        },
      ],
    },
  ];

  isActive(link: string): boolean {
    // return this.router.url === link;
    return false;
  }
}
