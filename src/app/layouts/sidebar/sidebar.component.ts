import { CommonModule } from '@angular/common';
import { Component, HostBinding, OnInit, inject } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { obtenerContenedorImagen, obtenerContenedorNombre } from '@app/modules/contenedor/store/selectors/contenedor.selectors';
import { Store } from '@ngrx/store';
import { filter } from 'rxjs/operators';
import { SIDEBAR_MENU, SidebarMenuItem } from './sidebar-menu.config';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent implements OnInit {
  @HostBinding('class') hostClass =
    'sidebar h-100 dark:bg-coal-600 bg-light border-r border-r-gray-200 dark:border-r-coal-100 fixed z-20 lg:flex flex-col items-stretch shrink-0';
  @HostBinding('style') style = { height: '100% !important' };
  @HostBinding('attr.data-drawer') drawer = 'true';
  @HostBinding('attr.data-drawer-class') drawerClass = 'drawer drawer-start top-0 bottom-0';
  @HostBinding('attr.data-drawer-enable') drawerEnable = 'true|lg:false';
  @HostBinding('attr.id') id = 'sidebar';

  private _store = inject(Store);
  private router = inject(Router);
  private currentUrl = '';

  public sidebarMenu: SidebarMenuItem[] = SIDEBAR_MENU;
  public contenedorImagen = this._store.selectSignal(obtenerContenedorImagen);
  public contenedorNombre = this._store.selectSignal(obtenerContenedorNombre);

  ngOnInit(): void {
    // Obtener la URL actual al inicializar el componente
    this.currentUrl = this.router.url;
    this.updateMenuState();

    // Suscribirse a los cambios de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.currentUrl = event.url;
        this.updateMenuState();
      });
  }

  /**
   * Verifica si un enlace está activo
   */
  isActive(link: string): boolean {
    return this.currentUrl === link;
  }

  /**
   * Actualiza el estado del menú basado en la URL actual
   */
  private updateMenuState(): void {
    this.sidebarMenu.forEach(menu => {
      // Resetear estado activo
      menu.activo = false;

      if (menu.tipoAcordion && menu.children) {
        // Verificar si algún hijo está activo
        const hasActiveChild = menu.children.some((child: any) => this.currentUrl === child.link);

        if (hasActiveChild) {
          menu.abierto = true;
          menu.activo = true;
        } else {
          // Verificar si la URL actual comienza con el link del menú padre
          const isParentActive = this.currentUrl.startsWith(menu.link);
          menu.abierto = isParentActive;
          menu.activo = isParentActive;
        }
      } else {
        // Para elementos que no son acordeón
        menu.activo = this.currentUrl === menu.link;
      }
    });
  }
}
