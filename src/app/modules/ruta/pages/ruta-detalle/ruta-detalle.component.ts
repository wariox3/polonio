import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import {
  CampoDetalle,
  TablaDetallesComponent,
} from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { Ruta } from '../../interfaces/ruta.interface';
import { RutaRepository } from '../../repositories/ruta.repository';
import { obtenerCamposRutaDetalle } from '../../mapping/ruta-detalle.mapeo';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-ruta-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaDetallesComponent],
  templateUrl: './ruta-detalle.component.html',
})
export default class RutaDetalleComponent implements OnInit {
  private _rutaRepository = inject(RutaRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  public rutaSignal = signal<Ruta>({
    id: 0,
    nombre: '',
  });
  camposDetalle = computed<CampoDetalle[]>(() => {
    return obtenerCamposRutaDetalle();
  });
  ngOnInit(): void {
    this.consultarInformacion();
  }
  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          return this._rutaRepository.detalle(param.id);
        }),
        tap(detalle => this.rutaSignal.set(detalle))
      )
      .subscribe();
  }
}
