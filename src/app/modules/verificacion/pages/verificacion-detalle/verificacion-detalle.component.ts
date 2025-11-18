import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Verificacion } from '../../interfaces/verificacion.interface';
import { Subject, switchMap, takeUntil, tap } from 'rxjs';
import { AlertaService } from '@app/common/services/alerta.service';
import { CampoDetalle } from '@tamerlantian/ui-components/lib/components/data/tabla-detalles/tabla-detalle.interface';
import { obtenerCamposVerificacionDetalle } from '../../mapping/verificacion-detalle.mapeo';
import { TablaDetallesComponent } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { VerificacionRepository } from '../../repository/verificacion.repository';
import { SiNoPipe } from '@app/common/pipes/si-no.pipe';
import { formatoFecha } from '@app/common/pipes/formatoFecha.pipe';

@Component({
  selector: 'app-verificacion-detalle',
  standalone: true,
  imports: [CommonModule, RouterModule, TablaDetallesComponent, SiNoPipe, formatoFecha],
  templateUrl: './verificacion-detalle.component.html',
  styleUrl: './verificacion-detalle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VerificacionDetalle implements OnInit {
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private _alertaService = inject(AlertaService);
  private _verificacionService = inject(VerificacionRepository);
  public verificacionSignal = signal<Verificacion>({
    id: 0,
    fecha_registro: '',
    verificador: '',
    vehiculo_placa: '',
    usuario_id: '',
    fecha_verificacion: '',
    fecha_verificacion_vence: '',
    verificado: false,
    estado_procesado: false,
  });
  public verificacionDetalles = signal<any[]>([]);
  camposDetalle = computed<CampoDetalle[]>(() => {
    return obtenerCamposVerificacionDetalle();
  });

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => this.consultarEncabezado(param.id)),
        switchMap(() => this.consultarDetalles())
      )
      .subscribe({
        next: () => {},
        error: error => {
          this._alertaService.mostrarError('Error al cargar la información');
          console.error('Error:', error);
        },
      });
  }

  consultarEncabezado(id: number) {
    return this._verificacionService.getDetalle(id).pipe(
      tap(detalle => {
        this.verificacionSignal.set(detalle);
      })
    );
  }

  consultarDetalles() {
    const verificacionId = this.verificacionSignal().id;

    return this._verificacionService.detallesPorVerificacion(verificacionId).pipe(
      tap(response => {
        this.verificacionDetalles.set(
          response.results.map((detalle: any) => ({
            id: detalle.id,
            verificacion_concepto: detalle.verificacion_concepto,
            verificado: detalle.verificado,
            fecha_verificacion: detalle.fecha_verificacion,
          }))
        );
      })
    );
  }

  verificarDetalle(id: number) {
    this._verificacionService.verificarDetalle(id).subscribe({
      next: () => {
        this.consultarDetalles().subscribe();
      },
    });
  }

  verificar() {
    const verificacionId = this.verificacionSignal().id;
    this._verificacionService.verificar(verificacionId).subscribe({
      next: () => {
        this.consultarEncabezado(verificacionId).subscribe();
      },
    });
  }
}
