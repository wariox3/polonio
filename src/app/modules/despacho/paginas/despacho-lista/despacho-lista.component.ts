import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { forkJoin } from 'rxjs';
import { Despacho } from '../../interfaces/despacho.interface';
import { columnasDespachoLista } from '../../mapeo/despacho-lista.mapeo';
import { DespachoRepository } from '../../repository/despacho.repository';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { DESPACHO_LISTA_FILTERS } from '../../mapeo/despacho-filtros.mapeo';

@Component({
  selector: 'app-despacho-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent, PaginadorComponent, FiltroComponent],
  templateUrl: './despacho-lista.component.html',
  styleUrl: './despacho-lista.component.scss',
})
export default class DespachoListaComponent implements OnInit {
  private _despachoRepository = inject(DespachoRepository);
  private filtrosActivos = signal<QueryParams>({});

  public despachosSeleccionados = signal<Despacho[]>([]);
  public camposFiltros = DESPACHO_LISTA_FILTERS;
  public despachos = signal<Despacho[]>([]);
  public columnas = columnasDespachoLista;
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

    this._despachoRepository.lista(parametros).subscribe(respuesta => {
      this.despachos.set(respuesta.results);
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

  onSeleccionDespachos(despachos: Despacho[]) {
    this.despachosSeleccionados.set(despachos);
  }

  eliminar() {
    const eliminaciones$ = this.despachosSeleccionados().map(despacho =>
      this._despachoRepository.eliminar(despacho.id)
    );

    forkJoin(eliminaciones$).subscribe({
      next: () => {
        // Después de eliminar, volver a la primera página y recargar
        this.estadoPaginacion.update(estado => ({
          ...estado,
          paginaActual: 1,
        }));
        this.consultarInformacion();
        this.despachosSeleccionados.set([]);
      },
      error: err => {
        console.error('Error al eliminar despacho:', err);
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
