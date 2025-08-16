import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Operacion } from '../../interfaces/operacion.interface';
import { OperacionRepository } from '../../repositories/operacion.repository';
import { obtenerCamposOperacionDetalle } from '../../mapping/operacion-detalle.mapeo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-operacion-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaDetallesComponent],
  templateUrl: './operacion-detalle.component.html',
  styleUrl: './operacion-detalle.component.scss',
})
export default class OperacionDetalleComponent implements OnInit {
  private _operacionRepository = inject(OperacionRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  public operacionSignal = signal<Operacion>({
    id: 0,
    nombre: '',
    ciudad: '',
    ciudad__nombre: '',
  });
  camposDetalle = computed<CampoDetalle[]>(() => {
    return obtenerCamposOperacionDetalle();
  });
  ngOnInit(): void {
    this.consultarInformacion();
  }
  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._operacionRepository.detalle(param.id);
        }),
        tap(detalle => this.operacionSignal.set(detalle))
      )
      .subscribe();
  }
}
