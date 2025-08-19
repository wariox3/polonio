import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { catchError, forkJoin, of } from 'rxjs';
import { Guia } from '../../interfaces/guia.interface';
import { columnasGuiaLista } from '../../mapping/guia-lista.mapeo';
import { GuiaRepository } from '../../repositories/guia.repository';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { GUIA_LISTA_FILTERS } from '../../mapping/guia-filtros.mapeo';

@Component({
  selector: 'app-guia-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent, PaginadorComponent, FiltroComponent],
  templateUrl: './guia-lista.component.html',
  styleUrl: './guia-lista.component.scss',
})
export default class GuiaListaComponent implements OnInit {
  private _guiaRepository = inject(GuiaRepository);
  private filtrosActivos = signal<QueryParams>({});

  public guiasSeleccionadas = signal<Guia[]>([]);
  public camposFiltros = GUIA_LISTA_FILTERS;
  public guias = signal<Guia[]>([]);
  public columnas = columnasGuiaLista;
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
      const guias = respuesta.results.map((guia: Guia) => {
        return {
          ...guia,
          total: guia.flete + guia.manejo,
        };
      });

      this.guias.set(guias);
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

  private actualizarPaginacion(count: number) {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      totalItems: count,
      totalPaginas: Math.ceil(count / estado.itemsPorPagina),
    }));
  }
}
