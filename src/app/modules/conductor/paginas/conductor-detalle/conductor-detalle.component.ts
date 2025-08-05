import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Conductor } from '../../interfaces/conductor.interface';
import { ConductorRepository } from '../../repository/conductor.repository';

@Component({
  selector: 'app-conductor-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule],
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
    rh: 0,
    rh__nombre: '',
    rh__codigo: '',
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
    categoria_licencia: '',
    fecha_nacimiento: '',
    fecha_vence_licencia: '',
    fecha_expedicion_licencia: '',
    fecha_ingreso: undefined,
    fecha_retiro: undefined,
    propio: false,
    estado_inactivo: false,
    estado_revisado: false,
    comentario: '',
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
