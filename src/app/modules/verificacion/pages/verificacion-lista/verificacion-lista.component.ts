import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { VerificacionRepository } from '../../repository/verificacion.repository';
import { Verificacion } from '../../interfaces/verificacion.interface';
import { VERIFICACION_LISTA_FILTERS } from '../../mapping/verificacion-filtros.mapeo';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { columnasVerificacionLista } from '../../mapping/verificacion-lista.mapeo';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-verificacion-lista',
  standalone: true,
  imports: [FiltroComponent, PaginadorComponent, TablaComponent],
  templateUrl: 'verificacion-lista.component.html',
  styleUrl: './verificacion-lista.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class VerificacionLista implements OnInit {
  private _verificacionService = inject(VerificacionRepository);
  private _filtrosActivos = signal<QueryParams>({});

  public verificacionesSeleccionados = signal<Verificacion[]>([]);
  public camposFiltros = VERIFICACION_LISTA_FILTERS;
  public columnas = columnasVerificacionLista;
  public verificaciones = signal<Verificacion[]>([]);
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

    this._verificacionService.lista(parametros).subscribe(respuesta => {
      this.verificaciones.set(respuesta.results);
      this.actualizarPaginacion(respuesta.count);
    });
  }

  onFiltersChange(filtros: QueryParams): void {
    this._filtrosActivos.set(filtros);
    this.estadoPaginacion.update(estado => ({
      ...estado,
      paginaActual: 1,
    }));

    this.consultarInformacion();
  }

  onPageChange(nuevaPagina: number): void {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      paginaActual: nuevaPagina,
    }));

    this.consultarInformacion();
  }

  onSeleccionVehiculos(verificaciones: Verificacion[]) {
    this.verificacionesSeleccionados.set(verificaciones);
  }

  private actualizarPaginacion(count: number) {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      totalItems: count,
      totalPaginas: Math.ceil(count / estado.itemsPorPagina),
    }));
  }

  procesar() {
    const procesados$ = this.verificacionesSeleccionados().map(verificacion =>
      this._verificacionService.proceso(verificacion.id).pipe(
        catchError(err => {
          console.error(`Error al eliminar vehículos ${verificacion.id}:`, err);
          return of(null);
        })
      )
    );
    forkJoin(procesados$).subscribe({
      next: () => {
        this.estadoPaginacion.update(estado => ({
          ...estado,
          paginaActual: 1,
        }));
        this.consultarInformacion();
        this.verificacionesSeleccionados.set([]);
      },
      error: err => {
        console.error('Error al eliminar vehículos:', err);
      },
    });
  }
}
