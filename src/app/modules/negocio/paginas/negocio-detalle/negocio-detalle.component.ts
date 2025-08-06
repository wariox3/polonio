import { Negocio } from './../../interfaces/negocio.interface';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { NegocioRepository } from '../../repository/negocio.repository';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { obtenerCamposNegocioDetalle } from '../../mapeo/negocio-detalle.mapeo';

@Component({
  selector: 'app-negocio-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaDetallesComponent],
  templateUrl: './negocio-detalle.component.html',
  styleUrl: './negocio-detalle.component.scss',
})
export default class NegocioDetalleComponent implements OnInit, OnDestroy {
  private _negocioRepository = inject(NegocioRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  public negocioSignal = signal<Negocio>({
    id: 0,
    fecha: '',
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
}
