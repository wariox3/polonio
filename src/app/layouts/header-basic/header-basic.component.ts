import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  HostBinding,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { MenuComponent } from '../menu/menu.component';
import { environment } from '@environments/environment';
import { MenuItem } from '@app/common/interfaces/menu.interface';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-header-basic',
  standalone: true,
  imports: [CommonModule, MenuComponent],
  templateUrl: './header-basic.component.html',
  styleUrl: './header-basic.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HeaderBasicComponent implements OnInit {
  @HostBinding('class') hostClass =
    'fixed py-4 top-0 z-10 left-0 right-0 flex items-stretch shrink-0 bg-[#fefefe] dark:bg-coal-500 shadow-sm dark:border-b dark:border-b-coal-100';
  @HostBinding('attr.role') hostRole = 'banner';
  @HostBinding('attr.data-sticky') dataSticky = 'true';
  @HostBinding('attr.data-sticky-name') dataStickyName = 'header';
  @HostBinding('id') hostId = 'header';

  private store = inject(Store);

  public URL_REDDOC_CUENTA = environment.URL_REDDOC_CUENTA;
  public nombreUsuario = signal('');

  public menuItems: MenuItem[] = [
    {
      titulo: 'Gestionar cuenta',
      icono: 'ki-filled ki-user',
      newWindow: true,
      link: this.URL_REDDOC_CUENTA,
    },
  ];

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.store.select(selectCurrentUser).subscribe(usuario => {
      if (usuario) {
        // Usar nombre_corto si está disponible, de lo contrario usar nombre + apellido
        const nombreCompleto = usuario.nombre_corto || `${usuario.nombre} ${usuario.apellido}`;
        this.nombreUsuario.set(nombreCompleto);
      }
    });
  }
}
