import { Component, EventEmitter, inject, OnDestroy, Output, signal } from '@angular/core';
import { ModalStandardComponent } from '@app/common/components/ui/modals/modal-standard/modal-standard.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { ModalService } from '@app/common/services/modal.service';
import { Guia } from '@app/modules/guia/interfaces/guia.interface';
import { columnasDespachoModalGuiaPendiente } from '@app/modules/despacho/mapping/detalle/despacho-detalle-guia-pendiente.mapeo';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { GuiaRepository } from '@app/modules/guia/repositories/guia.repository';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { catchError, forkJoin, of, Subject, switchMap, takeUntil } from 'rxjs';
import { DespachoDetalleRepository } from '../../repositories/despacho-detalle.repository';
import { ActivatedRoute } from '@angular/router';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';

@Component({
  selector: 'app-despacho-modal-lista-guias-pendiente',
  standalone: true,
  imports: [ModalStandardComponent, TablaComponent, PaginadorComponent],
  templateUrl: './despacho-modal-lista-guias-pendiente.component.html',
})
export class DespachoModalListaGuiasPendienteComponent implements OnDestroy {
  private _modalService = inject(ModalService);
  private _guiaRepository = inject(GuiaRepository);
  private _despachoDetalleRepository = inject(DespachoDetalleRepository);
  private filtrosActivos = signal<QueryParams>({
    estado_despachado: 'False',
  });
  private _activatedRoute = inject(ActivatedRoute);
  private destroy$ = new Subject<void>();

  public guias = signal<Guia[]>([]);
  public guiasSeleccionadas = signal<Guia[]>([]);
  public columnas = columnasDespachoModalGuiaPendiente;
  public estadoPaginacion = signal<EstadoPaginacion>({
    paginaActual: 1,
    itemsPorPagina: 30,
    totalItems: 0,
  });
  @Output() registroExitoso = new EventEmitter<boolean>(false);

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  openModal() {
    this._modalService.open('agregarGuiaPendiente');
    this.consultarInformacion();
  }

  closeModal() {
    this._modalService.close('agregarGuiaPendiente');
  }

  onSeleccionGuias(guias: Guia[]) {
    this.guiasSeleccionadas.set(guias);
  }

  consultarInformacion() {
    const parametros: QueryParams = {
      page: this.estadoPaginacion().paginaActual,
      ...this.filtrosActivos(),
    };

    this._guiaRepository.lista(parametros).subscribe(respuesta => {
      this.guias.set(respuesta.results);
      this._actualizarPaginacion(respuesta.count);
    });
  }

  agregarGuias() {
    this._activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param: { id: number }) => {
          const despachoId = Number(param.id);

          const nuevos$ = this.guiasSeleccionadas().map(guia =>
            this._despachoDetalleRepository
              .nuevo({
                id: despachoId,
                guia_id: guia.id,
              })
              .pipe(
                catchError(err => {
                  console.error(`Error al agregar guia ${guia.id}:`, err);
                  this.guiasSeleccionadas.set([]);
                  return of(null); // devolvemos algo para que forkJoin no falle
                })
              )
          );

          return forkJoin(nuevos$);
        })
      )
      .subscribe({
        next: () => {
          // Después de agregar, volver a la primera página y recargar
          this.estadoPaginacion.update(estado => ({
            ...estado,
            paginaActual: 1,
          }));
          this.guiasSeleccionadas.set([]);
          this.closeModal();
          this.registroExitoso.emit(true);
        },
        error: err => {
          console.error('Error al agregar guías:', err);
          this.guiasSeleccionadas.set([]);
        },
      });
  }

  onPageChange(nuevaPagina: number): void {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      paginaActual: nuevaPagina,
    }));

    this.consultarInformacion();
  }

  private _actualizarPaginacion(count: number) {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      totalItems: count,
      totalPaginas: Math.ceil(count / estado.itemsPorPagina),
    }));
  }
}
