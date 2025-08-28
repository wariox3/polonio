import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { Subject, switchMap, takeUntil } from 'rxjs';
import { GuiaDetalle } from '../../interfaces/detalle/guia-detalle-.interface';
import { columnasGuiaDespacho } from '../../mapping/detalle/guia-detalle-despacho.mapeo';
import { GuiaDetalleRepository } from '../../repositories/guia-detalle.repository';
import { DetalleParametros } from '@app/common/interfaces/detalle-parametros.interface';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-guia-tab-despacho',
  standalone: true,
  imports: [TablaComponent],
  templateUrl: './guia-tab-despacho.component.html',
})
export class GuiaTabDespachoComponent implements OnInit, OnDestroy {
  private _guiaDetalleRepository = inject(GuiaDetalleRepository);
  private destroy$ = new Subject<void>();
  private filtrosActivos = signal<QueryParams>({});
  public despachos = signal<GuiaDetalle[]>([]);
  public columnas = columnasGuiaDespacho;
  private _activatedRoute = inject(ActivatedRoute);

  ngOnInit() {
    this.consultarInformacion();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  consultarInformacion() {
    const parametros: QueryParams = {
      ...this.filtrosActivos(),
    };

    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: DetalleParametros) => {
          const guiaId = Number(param.id);
          return this._guiaDetalleRepository.lista({
            ...parametros,
            serializador: 'guia',
            guia_id: guiaId,
          });
        })
      )
      .subscribe(respuesta => {
        this.despachos.set(respuesta.results);
      });
  }
}
