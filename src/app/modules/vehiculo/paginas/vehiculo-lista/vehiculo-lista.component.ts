import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { forkJoin } from 'rxjs';
import { Vehiculo } from '../../interfaces/vehiculo.interface';
import { columnasVehiculoLista } from '../../mapeo/vehiculo-lista.mapeo';
import { VehiculoRepository } from '../../repository/vehiculo.repository';

@Component({
  selector: 'app-vehiculo-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent, PaginadorComponent],
  templateUrl: './vehiculo-lista.component.html',
})
export default class VehiculoListaComponent implements OnInit {
  private _vehiculoService = inject(VehiculoRepository);
  public vehiculosSeleccionados = signal<Vehiculo[]>([]);
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

  onSeleccionVehiculos(vehiculos: Vehiculo[]) {
    this.vehiculosSeleccionados.set(vehiculos);
  }

  eliminar() {
    const eliminaciones$ = this.vehiculosSeleccionados().map(vehiculo =>
      this._vehiculoService.eliminar(vehiculo.id)
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
