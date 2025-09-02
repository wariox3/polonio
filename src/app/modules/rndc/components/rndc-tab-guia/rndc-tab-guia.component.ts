import { Component, OnInit, inject, signal } from '@angular/core';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { Guia } from '@app/modules/guia/interfaces/guia.interface';
import { GuiaRepository } from '@app/modules/guia/repositories/guia.repository';
import { columnasGuiaLista } from '../../mapping/rndc-tab-guia-lista/rndc-tab-guia-lista.mapeo';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { GUIA_LISTA_FILTERS } from '../../mapping/rndc-tab-guia-lista/rndc-tab-guia-filtros.mapeo';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-rndc-tab-guia',
  standalone: true,
  imports: [TablaComponent, PaginadorComponent, FiltroComponent],
  templateUrl: './rndc-tab-guia.component.html',
})
export class RndcTabGuiaComponent implements OnInit {
  private _guiaRepository = inject(GuiaRepository);
  private filtrosActivos = signal<QueryParams>({});

  public guias = signal<Guia[]>([]);
  public guiasSeleccionadas = signal<Guia[]>([]);
  public columnas = columnasGuiaLista;
  public camposFiltros = GUIA_LISTA_FILTERS;
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

  enviarRndc() {
    const enviar$ = this.guiasSeleccionadas().map(guia =>
      this._guiaRepository.enviarRndc(guia.id).pipe(
        catchError(err => {
          console.error(`Error al enviar RNDc para guia ${guia.id}:`, err);
          return of(null); // devolvemos algo para que forkJoin no falle
        })
      )
    );

    forkJoin(enviar$).subscribe({
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

  onSeleccionGuias(guias: Guia[]) {
    this.guiasSeleccionadas.set(guias);
  }

  private actualizarPaginacion(count: number) {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      totalItems: count,
      totalPaginas: Math.ceil(count / estado.itemsPorPagina),
    }));
  }
}
