import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { catchError, forkJoin, of } from 'rxjs';
import { Conductor } from './../../interfaces/conductor.interface';
import { columnasConductorLista } from '../../mapping/conductor-lista.mapeo';
import { CONDUCTOR_LISTA_FILTERS } from '../../mapping/conductor-filtros.mapeo';
import { ConductorRepository } from '../../repositories/conductor.repository';

@Component({
  selector: 'app-conductor-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent, PaginadorComponent, FiltroComponent],
  templateUrl: './conductor-lista.component.html',
  styleUrl: './conductor-lista.component.scss',
})
export default class ConductorListaComponent implements OnInit {
  private _conductorRepository = inject(ConductorRepository);
  private _filtrosActivos = signal<QueryParams>({
    conductor: 'True',
    serializador: 'lista',
  });

  public conductoresSeleccionados = signal<Conductor[]>([]);
  public conductores = signal<Conductor[]>([]);
  public columnas = columnasConductorLista;
  public camposFiltros = CONDUCTOR_LISTA_FILTERS;
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
      page_size: this.estadoPaginacion().itemsPorPagina,
      ...this._filtrosActivos(),
    };

    this._conductorRepository.lista(parametros).subscribe(respuesta => {
      this.conductores.set(respuesta.results);
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

  onSeleccionConductores(conductores: Conductor[]) {
    this.conductoresSeleccionados.set(conductores);
  }

  onFiltersChange(filtros: QueryParams): void {
    this._filtrosActivos.set({
      ...filtros,
      conductor: 'True',
      serializador: 'lista',
    });
    this.estadoPaginacion.update(estado => ({
      ...estado,
      paginaActual: 1,
    }));
    this.consultarInformacion();
  }

  eliminar() {
    const eliminaciones$ = this.conductoresSeleccionados().map(conductor =>
      this._conductorRepository.eliminar(conductor.id).pipe(
        catchError(err => {
          console.error(`Error al eliminar conductor ${conductor.id}:`, err);
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
        this.conductoresSeleccionados.set([]);
      },
      error: err => {
        console.error('Error al eliminar conductor:', err);
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
