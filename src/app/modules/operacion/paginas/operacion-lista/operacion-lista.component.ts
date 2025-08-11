import { Component, inject, OnInit, signal } from '@angular/core';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { forkJoin } from 'rxjs';
import { Operacion } from '../../interfaces/operacion.interface';
import { OPERACION_LISTA_FILTERS } from '../../mapeo/operacion-filtros.mapeo';
import { columnasOperacionLista } from '../../mapeo/operacion-lista.mapeo';
import { OperacionRepository } from '../../repository/operacion.repository';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-operacion-lista',
  standalone: true,
  imports: [FiltroComponent, PaginadorComponent, TablaComponent, RouterModule],
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
    const eliminaciones$ = this.operacionSeleccionadas().map(guia =>
      this._operacionRepository.eliminar(guia.id)
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
