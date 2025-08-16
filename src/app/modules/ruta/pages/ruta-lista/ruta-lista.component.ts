import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { forkJoin } from 'rxjs';
import { Ruta } from '../../interfaces/ruta.interface';
import { RUTA_LISTA_FILTERS } from '../../mapping/ruta-filtros.mapeo';
import { columnasRutaLista } from '../../mapping/ruta-lista.mapeo';
import { RutaRepository } from '../../repositories/ruta.repository';

@Component({
  selector: 'app-ruta-lista',
  standalone: true,
  imports: [FiltroComponent, PaginadorComponent, TablaComponent, RouterModule],
  templateUrl: './ruta-lista.component.html',
})
export default class RutaListaComponent implements OnInit {
  private _rutaRepository = inject(RutaRepository);
  private filtrosActivos = signal<QueryParams>({});
  public rutaSeleccionadas = signal<Ruta[]>([]);
  public camposFiltros = RUTA_LISTA_FILTERS;
  public rutas = signal<Ruta[]>([]);
  public columnas = columnasRutaLista;
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

    this._rutaRepository.lista(parametros).subscribe(respuesta => {
      this.rutas.set(respuesta.results);
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

  onSeleccionRuta(rutas: Ruta[]) {
    this.rutaSeleccionadas.set(rutas);
  }

  eliminar() {
    const eliminaciones$ = this.rutaSeleccionadas().map(guia =>
      this._rutaRepository.eliminar(guia.id)
    );

    forkJoin(eliminaciones$).subscribe({
      next: () => {
        // Después de eliminar, volver a la primera página y recargar
        this.estadoPaginacion.update(estado => ({
          ...estado,
          paginaActual: 1,
        }));
        this.consultarInformacion();
        this.rutaSeleccionadas.set([]);
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
