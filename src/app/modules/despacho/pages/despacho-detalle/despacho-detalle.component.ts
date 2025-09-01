import { Despacho } from './../../interfaces/despacho.interface';
import { Component, computed, inject, OnInit, OnDestroy, signal } from '@angular/core';
import { DespachoRepository } from '../../repositories/despacho.repository';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { CommonModule } from '@angular/common';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { obtenerCamposDespachoDetalle } from '../../mapping/detalle/despacho-detalle.mapeo';
import { DespachoTabGuiaComponent } from '../../components/despacho-tab-guia/despacho-tab-guia.component';

@Component({
  selector: 'app-despacho-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaDetallesComponent, DespachoTabGuiaComponent],
  templateUrl: './despacho-detalle.component.html',
  styleUrl: './despacho-detalle.component.scss',
})
export default class DespachoDetalleComponent implements OnInit, OnDestroy {
  private _despachoRepository = inject(DespachoRepository);
  private _activatedRoute = inject(ActivatedRoute);
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
  });

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
}
