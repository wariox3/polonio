import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { EstadoBadgesContainerComponent } from '@app/common/components/ui/badges/estado-badges-container/estado-badges-container.component';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { GuiaTabDespachoComponent } from '../../components/guia-tab-despacho/guia-tab-despacho.component';
import {
  configuracionEstados,
  obtenerCamposGuiaDetalle,
  obtenerCamposGuiaDetalleDestinatario,
} from '../../mapping/detalle/guia-detalle.mapeo';
import { GuiaRepository } from '../../repositories/guia.repository';
import { Guia } from './../../interfaces/guia.interface';

@Component({
  selector: 'app-guia-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TablaDetallesComponent,
    EstadoBadgesContainerComponent,
    GuiaTabDespachoComponent,
  ],
  templateUrl: './guia-detalle.component.html',
  styleUrl: './guia-detalle.component.scss',
})
export default class GuiaDetalleComponent implements OnInit {
  private _guiaRepository = inject(GuiaRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  public activeTab: string = 'despacho';
  public guiaSignal = signal<Guia | null>(null);
  public configuracionEstados = configuracionEstados;
  public camposDetalleGuia = computed<CampoDetalle[]>(() => {
    return obtenerCamposGuiaDetalle();
  });
  public camposDetalleDestinatario = computed<CampoDetalle[]>(() => {
    return obtenerCamposGuiaDetalleDestinatario();
  });

  ngOnInit(): void {
    this.consultarInformacion();
  }
  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._guiaRepository.detalleExtendido(param.id);
        }),
        tap(detalle => this.guiaSignal.set(detalle.results[0]))
      )
      .subscribe();
  }
}
