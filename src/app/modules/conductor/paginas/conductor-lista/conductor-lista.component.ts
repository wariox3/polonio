import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { forkJoin } from 'rxjs';
import { Conductor } from './../../interfaces/conductor.interface';
import { columnasConductorLista } from '../../mapeo/conductor-lista.mapeo';
import { ConductorRepository } from '../../repository/conductor.repository';

@Component({
  selector: 'app-conductor-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent, PaginadorComponent],
  templateUrl: './conductor-lista.component.html',
  styleUrl: './conductor-lista.component.scss',
})
export default class ConductorListaComponent implements OnInit {
  private _conductorRepository = inject(ConductorRepository);

  public conductoresSeleccionados = signal<Conductor[]>([]);
  public conductores = signal<Conductor[]>([]);
  public columnas = columnasConductorLista;
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

  eliminar() {
    const eliminaciones$ = this.conductoresSeleccionados().map(conductor =>
      this._conductorRepository.eliminar(conductor.id)
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
