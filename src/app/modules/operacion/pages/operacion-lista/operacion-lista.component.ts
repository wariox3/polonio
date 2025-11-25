import { Component, inject, OnInit, signal } from '@angular/core';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { catchError, forkJoin, of } from 'rxjs';
import { Operacion } from '../../interfaces/operacion.interface';
import { OPERACION_LISTA_FILTERS } from '../../mapping/operacion-filtros.mapeo';
import { columnasOperacionLista } from '../../mapping/operacion-lista.mapeo';
import { OperacionRepository } from '../../repositories/operacion.repository';
import { RouterModule } from '@angular/router';
import { TablaComponent, PaginadorComponent } from '@tamerlantian/ui-components';

@Component({
  selector: 'app-operacion-lista',
  standalone: true,
  imports: [FiltroComponent, RouterModule, TablaComponent, PaginadorComponent],
  templateUrl: './operacion-lista.component.html',
})
export default class OperacionListaComponent implements OnInit {
  private _operacionRepository = inject(OperacionRepository);
  private filtrosActivos = signal<QueryParams>({});
  public operacionSeleccionadas = signal<Operacion[]>([]);
  public camposFiltros = OPERACION_LISTA_FILTERS;
  public operaciones = signal<Operacion[]>([]);
  public columnas = columnasOperacionLista;
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

    this._operacionRepository.lista(parametros).subscribe(respuesta => {
      this.operaciones.set(respuesta.results);
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
    this.filtrosActivos.set(filtros);
    this.estadoPaginacion.update(estado => ({
      ...estado,
      paginaActual: 1,
    }));

    this.consultarInformacion();
  }

  onSeleccionOperacion(operaciones: Operacion[]) {
    this.operacionSeleccionadas.set(operaciones);
  }

  eliminar() {
    const eliminaciones$ = this.operacionSeleccionadas().map(operacion =>
      this._operacionRepository.eliminar(operacion.id).pipe(
        catchError(err => {
          console.error(`Error al eliminar operacion ${operacion.id}:`, err);
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
        this.operacionSeleccionadas.set([]);
      },
      error: err => {
        console.error('Error al eliminar guia:', err);
      },
    });
  }

  private actualizarPaginacion(count: number) {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      totalItems: count,
      totalPaginas: Math.ceil(count / estado.itemsPorPagina),
    }));
  }
}
