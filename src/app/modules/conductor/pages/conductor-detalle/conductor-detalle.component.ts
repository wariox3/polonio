import { CommonModule } from '@angular/common';
import { Component, computed, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Conductor } from '../../interfaces/conductor.interface';
import { ConductorRepository } from '../../repositories/conductor.repository';
import { obtenerCamposConductorDetalle } from '../../mapping/conductor-detalle.mapeo';

@Component({
  selector: 'app-conductor-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaDetallesComponent],
  templateUrl: './conductor-detalle.component.html',
})
export default class conductorDetalleComponent implements OnInit, OnDestroy {
  private _conductorRepository = inject(ConductorRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  public vehiculosSignal = signal<Conductor>({
    id: 0,
    identificacion: 0,
    identificacion__nombre: '',
    digito_verificacion: 0,
    ciudad: 0,
    ciudad__nombre: '',
    ciudad__estado__nombre: '',
    numero_identificacion: '',
    nombre_corto: '',
    nombre1: '',
    nombre2: '',
    apellido1: '',
    apellido2: '',
    direccion: '',
    barrio: '',
    telefono: '',
    celular: '',
    correo: '',
    numero_licencia: '',
    categoria_licencia_id: 0,
    categoria_licencia_nombre: '',
    fecha_vence_licencia: '',
    identificacion_id: 0,
    ciudad_id: 0,
    ciudad_nombre: '',
    tipo_persona: 0,
    regimen: 0,
    tipo_persona_id: 0,
    regimen_id: 0,
  });
  camposDetalle = computed<CampoDetalle[]>(() => {
    return obtenerCamposConductorDetalle(this.vehiculosSignal());
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
          return this._conductorRepository.detalle(param.id);
        }),
        tap(detalle => this.vehiculosSignal.set(detalle))
      )
      .subscribe();
  }
}
