import { CommonModule } from '@angular/common';
import { AfterViewInit, ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';
import { HeaderComponent } from '../header/header.component';
import { SearchModalComponent } from '../../partials/search-modal/search-modal.component';
import KTLayout from '../../../metronic/app/layouts/demo1';
import { SidebarVerificacionComponent } from '../sidebar-verificacion/sidebar-verificacion.component';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    FooterComponent,
    SearchModalComponent,
    HeaderComponent,
    SidebarVerificacionComponent,
  ],
  templateUrl: './verificacion-layout.component.html',
  styleUrl: './verificacion-layout.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class AdminLayoutComponent implements AfterViewInit {
  ngAfterViewInit(): void {
    KTLayout.init();
  }
}
