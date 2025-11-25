import { Despacho } from './../../interfaces/despacho.interface';
import { Component, computed, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { DespachoRepository } from '../../repositories/despacho.repository';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { obtenerCamposDespachoDetalle } from '../../mapping/detalle/despacho-detalle.mapeo';
import { DespachoTabGuiaComponent } from '../../components/despacho-tab-guia/despacho-tab-guia.component';
import { DetalleParametros } from '@app/common/interfaces/detalle-parametros.interface';
import { AlertaService } from '@app/common/services/alerta.service';
import { EstadoBadgesContainerComponent } from '@app/common/components/ui/badges/estado-badges-container/estado-badges-container.component';
import { configuracionEstados } from '@app/modules/despacho/mapping/detalle/despacho-detalle.mapeo';

@Component({
  selector: 'app-despacho-detalle',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    TablaDetallesComponent,
    DespachoTabGuiaComponent,
    EstadoBadgesContainerComponent,
  ],
  templateUrl: './despacho-detalle.component.html',
  styleUrl: './despacho-detalle.component.scss',
})
export default class DespachoDetalleComponent implements OnInit, OnDestroy {
  private _despachoRepository = inject(DespachoRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private _alertaService = inject(AlertaService);
  private destroy$ = new Subject<void>();

  public activeTab: string = 'guia';
  public despachoSignal = signal<Despacho>({
    id: 0,
    vehiculo: 0,
    vehiculo__placa: '',
    remolque: 0,
    remolque__placa: '',
    conductor: 0,
    conductor__nombre_corto: '',
    ciudad_origen: 0,
    ciudad_origen__nombre: '',
    ciudad_destino: 0,
    ciudad_destino__nombre: '',
    pago: 0,
    comentario: '',
    ruta: 0,
    ruta__nombre: '',
    operacion: 0,
    operacion__nombre: '',
    flete: 0,
    despacho_tipo: 0,
    servicio: 0,
    precinto: '',
    estado_aprobado: false,
  });
  public configuracionEstados = configuracionEstados;
  camposDetalle = computed<CampoDetalle[]>(() => {
    return obtenerCamposDespachoDetalle();
  });

  ngOnInit(): void {
    this.consultarInformacion();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._despachoRepository.detalle(param.id);
        }),
        tap(detalle => this.despachoSignal.set(detalle))
      )
      .subscribe();
  }

  confirmarAprobacion() {
    this._alertaService
      .confirmar('¿Está seguro de que desea aprobar el registro?', 'Esta acción es irreversible.')
      .then(respuestaConfirmacion => {
        if (respuestaConfirmacion.isConfirmed) {
          this._aprobar();
        }
      });
  }

  exportarImprimir() {
    this._despachoRepository.imprimir(this.despachoSignal().id);
  }

  exportarManifiesto() {
    this._despachoRepository.imprimirManifiesto(this.despachoSignal().id);
  }

  private _aprobar() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        map((param: DetalleParametros) => Number(param.id)),
        switchMap(id => this._despachoRepository.aprobar(id)),
        tap((respuesta: { estado_aprobado: boolean }) => {
          this.despachoSignal.update(prev => ({
            ...prev,
            ...respuesta,
          }));
        })
      )
      .subscribe();
  }
}
