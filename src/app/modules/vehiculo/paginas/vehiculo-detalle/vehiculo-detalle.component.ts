import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Vehiculo } from '../../interfaces/vehiculo.interface';
import { CommonModule } from '@angular/common';
import { VehiculoRepository } from '../../repository/vehiculo.repository';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { obtenerCamposVehiculoDetalle } from '../../mapeo/vehiculo-detalle.mapeo';

@Component({
  selector: 'app-vehiculo-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaDetallesComponent],
  templateUrl: './vehiculo-detalle.component.html',
})
export default class VehiculoDetalleComponent implements OnInit {
  private _vehiculoRepository = inject(VehiculoRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  public vehiculosSignal = signal<Vehiculo>({
    id: 0,
    fecha_registro: '',
    placa: '',
    modelo: 0,
    modelo_repotenciado: undefined,
    motor: '',
    chasis: '',
    ejes: 0,
    peso_vacio: 0,
    capacidad: 0,
    celular: '',
    poliza: '',
    vence_poliza: '',
    tecnicomecanica: undefined,
    vence_tecnicomecanica: '',
    propio: false,
    remolque: false,
    estado_inactivo: false,
    estado_revisado: false,
    comentario: '',
    poseedor: 0,
    poseedor__nombre_corto: '',
    poseedor__numero_identificacion: '',
    propietario: 0,
    propietario__nombre_corto: '',
    propietario__numero_identificacion: '',
    aseguradora: 0,
    aseguradora__nombre_corto: '',
    color: 0,
    color__nombre: '',
    color__codigo: '',
    marca: 0,
    marca__nombre: '',
    marca__codigo: '',
    linea: 0,
    linea__nombre: '',
    linea__codigo: '',
    combustible: 0,
    combustible__nombre: '',
    combustible__codigo: '',
    carroceria: 0,
    carroceria__nombre: '',
    carroceria__codigo: '',
    configuracion: 0,
    configuracion__nombre: '',
    configuracion__codigo: '',
  });
  camposDetalle = computed<CampoDetalle[]>(() => {
    return obtenerCamposVehiculoDetalle();
  });

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._vehiculoRepository.detalle(param.id);
        }),
        tap(detalle => this.vehiculosSignal.set(detalle))
      )
      .subscribe();
  }
}
