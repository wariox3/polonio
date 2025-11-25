import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { catchError, forkJoin, of } from 'rxjs';
import { Vehiculo } from '../../interfaces/vehiculo.interface';
import { columnasVehiculoLista } from '../../mapping/vehiculo-lista.mapeo';
import { VEHICULO_LISTA_FILTERS } from '../../mapping/vehiculo-filtros.mapeo';
import { VehiculoRepository } from '../../repositories/vehiculo.repository';

@Component({
  selector: 'app-vehiculo-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent, PaginadorComponent, FiltroComponent],
  templateUrl: './vehiculo-lista.component.html',
})
export default class VehiculoListaComponent implements OnInit {
  private _vehiculoService = inject(VehiculoRepository);
  private _filtrosActivos = signal<QueryParams>({});

  public vehiculosSeleccionados = signal<Vehiculo[]>([]);
  public camposFiltros = VEHICULO_LISTA_FILTERS;
  public vehiculos = signal<Vehiculo[]>([]);
  public columnas = columnasVehiculoLista;
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
      ...this._filtrosActivos(),
    };

    this._vehiculoService.lista(parametros).subscribe(respuesta => {
      this.vehiculos.set(respuesta.results);
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
    this._filtrosActivos.set(filtros);
    this.estadoPaginacion.update(estado => ({
      ...estado,
      paginaActual: 1,
    }));

    this.consultarInformacion();
  }

  onSeleccionVehiculos(vehiculos: Vehiculo[]) {
    this.vehiculosSeleccionados.set(vehiculos);
  }

  eliminar() {
    const eliminaciones$ = this.vehiculosSeleccionados().map(vehiculo =>
      this._vehiculoService.eliminar(vehiculo.id).pipe(
        catchError(err => {
          console.error(`Error al eliminar vehículos ${vehiculo.id}:`, err);
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
        this.vehiculosSeleccionados.set([]);
      },
      error: err => {
        console.error('Error al eliminar vehículos:', err);
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
