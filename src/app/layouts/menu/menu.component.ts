import { CommonModule } from '@angular/common';
import { Component, inject, Input } from '@angular/core';
import { logout } from '@app/modules/auth/store/actions/login.action';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  @Input({ required: true }) titulo: string;
  @Input() subtitutlo: string;
  @Input({ required: true }) menuItems: any[];
  @Input() imagen: string;

  private store = inject(Store);

  cerrarSesion() {
    this.store.dispatch(logout());
  }
}
