import { Component, inject, OnInit, signal, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { catchError, finalize, forkJoin, from, mergeMap, of } from 'rxjs';
import { Negocio } from '../../interfaces/negocio.interface';
import { columnasNegocioLista } from '../../mapeo/negocio-lista.mapeo';
import { NegocioRepository } from '../../repository/negocio.repository';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { NEGOCIO_LISTA_FILTERS } from '../../mapeo/negocio-filtros.mapeo';

@Component({
  selector: 'app-negocio-lista',
  standalone: true,
  imports: [RouterModule, TablaComponent, PaginadorComponent, FiltroComponent],
  templateUrl: './negocio-lista.component.html',
  styleUrl: './negocio-lista.component.scss',
})
export default class NegocioListaComponent implements OnInit {
  private _negocioRepository = inject(NegocioRepository);
  private filtrosActivos = signal<QueryParams>({});
  private _changeDetectorRef = inject(ChangeDetectorRef);

  public negociosSeleccionados = signal<Negocio[]>([]);
  public camposFiltros = NEGOCIO_LISTA_FILTERS;
  public negocios = signal<Negocio[]>([]);
  public columnas = columnasNegocioLista;
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
      ...this.filtrosActivos(),
    };

    this._negocioRepository.lista(parametros).subscribe(respuesta => {
      this.negocios.set(respuesta.results);
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

  onSeleccionNegocios(negocios: Negocio[]) {
    if (!negocios || negocios.length === 0) {
      this.negociosSeleccionados.set([]);
      return;
    }

    this.negociosSeleccionados.update(actual => {
      const copia = [...actual];

      negocios.forEach(nuevo => {
        const idx = copia.findIndex(n => n.id === nuevo.id);
        if (idx >= 0) {
          // Si ya está, lo quitamos
          copia.splice(idx, 1);
        } else {
          // Si no está, lo agregamos
          copia.push(nuevo);
        }
      });

      return copia;
    });
  }

  eliminar() {
    const eliminaciones$ = this.negociosSeleccionados().map(negocio =>
      this._negocioRepository.eliminar(negocio.id).pipe(
        catchError(err => {
          console.error(`Error eliminando negocio ${negocio.id}:`, err);
          return of(null); // evitar que se rompa forkJoin
        })
      )
    );

    forkJoin(eliminaciones$)
      .pipe(
        finalize(() => {
          this.negociosSeleccionados.set([]);
          this.estadoPaginacion.update(estado => ({
            ...estado,
            paginaActual: 1,
          }));
          this.consultarInformacion(); // siempre se ejecuta
        })
      )
      .subscribe();
  }

  exportarExcel() {
    this._negocioRepository.descargarExcel(this.filtrosActivos());
  }

  private actualizarPaginacion(count: number) {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      totalItems: count,
      totalPaginas: Math.ceil(count / estado.itemsPorPagina),
    }));
  }
}
