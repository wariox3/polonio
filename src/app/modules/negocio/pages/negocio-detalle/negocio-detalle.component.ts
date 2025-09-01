import { Negocio } from './../../interfaces/negocio.interface';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NegocioRepository } from '../../repositories/negocio.repository';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import {
  configuracionEstados,
  obtenerCamposNegocioDetalle,
} from '../../mapping/negocio-detalle.mapeo';
import { EstadoBadgesContainerComponent } from '@app/common/components/ui/badges/estado-badges-container/estado-badges-container.component';
import { DetalleParametros } from '@app/common/interfaces/detalle-parametros.interface';
import { AlertaService } from '@app/common/services/alerta.service';

@Component({
  selector: 'app-negocio-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaDetallesComponent, EstadoBadgesContainerComponent],
  templateUrl: './negocio-detalle.component.html',
  styleUrl: './negocio-detalle.component.scss',
})
export default class NegocioDetalleComponent implements OnInit, OnDestroy {
  private _negocioRepository = inject(NegocioRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private _alertaService = inject(AlertaService);
  private destroy$ = new Subject<void>();
  public configuracionEstados = configuracionEstados;
  public negocioSignal = signal<Negocio>({
    id: 0,
    fecha: '',
    nombre: '',
    unidades: 0,
    peso: 0,
    volumen: 0,
    declara: 0,
    pago: 0,
    flete: 0,
    manejo: 0,
    comentario: '',
    contacto: 0,
    contacto__nombre_corto: '',
    ciudad_origen: 0,
    ciudad_origen__nombre: '',
    ciudad_destino: 0,
    ciudad_destino__nombre: '',
    publicar: false,
    servicio: 0,
    operacion: 0,
    producto: 0,
    empaque: 0,
    destinatario_nombre: '',
    destinatario_direccion: '',
    destinatario_telefono: '',
    destinatario_correo: '',
    estado_aprobado: false,
  });

  camposDetalle = computed<CampoDetalle[]>(() => {
    return obtenerCamposNegocioDetalle();
  });

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._negocioRepository.detalle(param.id);
        }),
        tap(detalle => this.negocioSignal.set(detalle))
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
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

  private _aprobar() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        map((param: DetalleParametros) => Number(param.id)),
        switchMap(id => this._negocioRepository.aprobar(id)),
        tap((respuesta: { estado_aprobado: boolean }) => {
          this.negocioSignal.update(prev => ({
            ...prev,
            ...respuesta,
          }));
        })
      )
      .subscribe();
  }
}
