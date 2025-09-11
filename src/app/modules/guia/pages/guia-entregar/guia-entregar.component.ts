import { Component, inject, OnInit, signal } from '@angular/core';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { catchError, forkJoin, of } from 'rxjs';
import { GuiaEntregarFormularioComponent } from '../../components/guia-entregar-formulario/guia-entregar-formulario.component';
import { Guia } from '../../interfaces/guia.interface';
import { GUIA_LISTA_FILTERS } from '../../mapping/guia-filtros.mapeo';
import { columnasGuiaProcesoEntrega } from '../../mapping/guia-lista.mapeo';
import { GuiaRepository } from '../../repositories/guia.repository';

@Component({
  selector: 'app-guia-entregar',
  standalone: true,
  imports: [FiltroComponent, PaginadorComponent, TablaComponent, GuiaEntregarFormularioComponent],
  templateUrl: './guia-entregar.component.html',
})
export default class GuiaEntregarComponent implements OnInit {
  private readonly parametrosBase = {
    serializador: 'lista',
    estado_entregado: 'False',
  };
  private _guiaRepository = inject(GuiaRepository);
  private filtrosActivos = signal<QueryParams>(this.parametrosBase);
  public camposFiltros = GUIA_LISTA_FILTERS;
  public columnas = columnasGuiaProcesoEntrega;
  public guias = signal<Guia[]>([]);
  public guiasSeleccionadas = signal<Guia[]>([]);
  public estadoPaginacion = signal<EstadoPaginacion>({
    paginaActual: 1,
    itemsPorPagina: 30,
    totalItems: 0,
  });

  ngOnInit(): void {
    this.consultarInformacion();
  }

  consultarInformacion() {
    const parametros: QueryParams = {
      page: this.estadoPaginacion().paginaActual,
      ...this.filtrosActivos(),
    };

    this._guiaRepository.lista(parametros).subscribe(respuesta => {
      this.guias.set(respuesta.results);
      this.actualizarPaginacion(respuesta.count);
    });
  }

  onPageChange(nuevaPagina: number): void {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      paginaActual: nuevaPagina,
    }));

    this.consultarInformacion();
  }

  onFiltersChange(filtros: QueryParams): void {
    this.filtrosActivos.set({
      ...filtros,
      ...this.parametrosBase,
    });
    this.estadoPaginacion.update(estado => ({
      ...estado,
      paginaActual: 1,
    }));

    this.consultarInformacion();
  }

  exportarExcel() {
    this._guiaRepository.descargarExcel(this.filtrosActivos());
  }

  onSeleccionGuias(guias: Guia[]) {
    this.guiasSeleccionadas.set(guias);
  }

  eliminar() {
    const eliminaciones$ = this.guiasSeleccionadas().map(guia =>
      this._guiaRepository.eliminar(guia.id).pipe(
        catchError(err => {
          console.error(`Error al eliminar guia ${guia.id}:`, err);
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
        this.guiasSeleccionadas.set([]);
      },
      error: err => {
        console.error('Error al eliminar guia:', err);
      },
    });
  }

  entregar() {
    throw new Error('Method not implemented.');
  }

  private actualizarPaginacion(count: number) {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      totalItems: count,
      totalPaginas: Math.ceil(count / estado.itemsPorPagina),
    }));
  }
}
