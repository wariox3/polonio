import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MenuItem } from '@app/common/interfaces/menu.interface';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { obtenerContenedorNombre } from '@app/modules/contenedor/store/selectors/contenedor.selectors';
import { environment } from '@environments/environment';
import { Store } from '@ngrx/store';
import { MenuComponent } from '../menu/menu.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderComponent implements OnInit {
  @HostBinding('class') hostClass =
    'header fixed top-0 z-10 left-0 right-0 flex items-stretch shrink-0 bg-[#fefefe] dark:bg-coal-500 shadow-sm dark:border-b dark:border-b-coal-100';
  @HostBinding('attr.role') hostRole = 'banner';
  @HostBinding('attr.data-sticky') dataSticky = 'true';
  @HostBinding('attr.data-sticky-name') dataStickyName = 'header';
  @HostBinding('id') hostId = 'header';

  private store = inject(Store);

  public URL_REDDOC_CUENTA = environment.URL_REDDOC_CUENTA;
  public nombreContenedor = signal('');
  public nombreUsuario = signal('');
  public imagenUsuario = signal('');

  public menuItems: MenuItem[] = [
    {
      titulo: 'Gestionar cuenta',
      icono: 'ki-filled ki-user-edit',
      link: this.URL_REDDOC_CUENTA,
      newWindow: true,
    },
    {
      titulo: 'Mis contenedores',
      icono: 'ki-filled ki-abstract-14',
      link: '/contenedor',
    },
  ];

  ngOnInit(): void {
    this.store.select(obtenerContenedorNombre).subscribe(nombre => {
      if (nombre) {
        this.nombreContenedor.set(nombre);
      }
    });

    this.store.select(selectCurrentUser).subscribe(usuario => {
      if (usuario) {
        // Usar nombre_corto si está disponible, de lo contrario usar nombre + apellido
        const nombreCompleto = usuario.nombre_corto || `${usuario.nombre} ${usuario.apellido}`;
        this.nombreUsuario.set(nombreCompleto);
        this.imagenUsuario.set(usuario.imagen_thumbnail);
      }
    });
  }
}
