import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { DespachoModalListaGuiasPendienteComponent } from '@app/modules/despacho/components/despacho-modal-lista-guias-pendiente/despacho-modal-lista-guias-pendiente.component';
import { catchError, forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';
import { DespachoDetalleParametros } from '../../interfaces/despacho-detalle/despacho-detalle-parametros.interface';
import { DespachoDetalle } from '../../interfaces/despacho-detalle/despacho-detalle.interface';
import { columnasDespachoGuia } from '../../mapping/detalle/despacho-detalle-guia.mapeo';
import { DespachoDetalleRepository } from '../../repositories/despacho-detalle.repository';
import { DespachoModalAgregarGuiaComponent } from '../despacho-modal-agregar-guia/despacho-modal-agregar-guia.component';
import { QueryParams } from '@app/core/interfaces/api.interface';

@Component({
  selector: 'app-despacho-tab-guia',
  standalone: true,
  imports: [
    TablaComponent,
    DespachoModalAgregarGuiaComponent,
    DespachoModalListaGuiasPendienteComponent,
    CommonModule,
    PaginadorComponent,
  ],
  templateUrl: './despacho-tab-guia.component.html',
})
export class DespachoTabGuiaComponent implements OnInit, OnDestroy {
  private _despachoDetalleRepository = inject(DespachoDetalleRepository);
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();
  private filtrosActivos = signal<QueryParams>({});

  public despachosSeleccionados = signal<DespachoDetalle[]>([]);
  public columnas = columnasDespachoGuia;
  public guias = signal<DespachoDetalle[]>([]);
  public estadoPaginacion = signal<EstadoPaginacion>({
    paginaActual: 1,
    itemsPorPagina: 30,
    totalItems: 0,
  });

  ngOnInit() {
    this.consultarInformacion();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  eliminar() {
    const eliminaciones$ = this.despachosSeleccionados().map(despacho =>
      this._despachoDetalleRepository.eliminar({ id: despacho.id }).pipe(
        catchError(err => {
          console.error(`Error al eliminar despacho ${despacho.id}:`, err);
          return of(null); // devolvemos algo para que forkJoin no falle
        })
      )
    );

    forkJoin(eliminaciones$).subscribe({
      next: () => {
        // Después de eliminar, volver a la primera página y recargar
        this.estadoPaginacion.update(estado => ({
          ...estado,
          paginaActual: 1,
        }));
        this.consultarInformacion();
        this.despachosSeleccionados.set([]);
      },
      error: err => {
        console.error('Error al eliminar despacho:', err);
      },
    });
  }

  onSeleccionDespachos(despachos: DespachoDetalle[]) {
    this.despachosSeleccionados.set(despachos);
  }

  consultarInformacion() {
    const parametros: QueryParams = {
      page: this.estadoPaginacion().paginaActual,
      ...this.filtrosActivos(),
    };

    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: DespachoDetalleParametros) => {
          const despachoId = Number(param.id);
          return this._despachoDetalleRepository.lista({ ...parametros, despacho_id: despachoId });
        })
      )
      .subscribe(respuesta => {
        this.guias.set(respuesta.results);
        this._actualizarPaginacion(respuesta.count);
      });
  }

  private _actualizarPaginacion(count: number) {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      totalItems: count,
      totalPaginas: Math.ceil(count / estado.itemsPorPagina),
    }));
  }

  onPageChange(nuevaPagina: number): void {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      paginaActual: nuevaPagina,
    }));

    this.consultarInformacion();
  }
}
