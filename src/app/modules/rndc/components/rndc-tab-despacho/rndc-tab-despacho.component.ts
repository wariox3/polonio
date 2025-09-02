import { Component, inject, OnInit, signal } from '@angular/core';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { Despacho } from '@app/modules/despacho/interfaces/despacho.interface';
import { DespachoRepository } from '@app/modules/despacho/repositories/despacho.repository';
import { columnasDespachoLista } from '../../mapping/rndc-tab-despacho/rndc-tab-despacho-lista.mapeo';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { DESPACHO_LISTA_FILTERS } from '../../mapping/rndc-tab-despacho/rndc-tab-despacho-filtros.mapeo';
import { catchError, forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-rndc-tab-despacho',
  standalone: true,
  imports: [PaginadorComponent, TablaComponent, FiltroComponent],
  templateUrl: './rndc-tab-despacho.component.html',
})
export class RndcTabDespachoComponent implements OnInit {
  private _despachoRepository = inject(DespachoRepository);
  private readonly parametrosBase = {
    serializador: 'lista',
  };
  private filtrosActivos = signal<QueryParams>(this.parametrosBase);

  public despachosSeleccionados = signal<Despacho[]>([]);
  public despachos = signal<Despacho[]>([]);
  public columnas = columnasDespachoLista;
  public camposFiltros = DESPACHO_LISTA_FILTERS;
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
    this.filtrosActivos.set({
      ...filtros,
      ...this.parametrosBase,
    });
    this.estadoPaginacion.update(estado => ({
      ...estado,
      paginaActual: 1,
    }));

    this.consultarInformacion();
  }

  enviarRndc() {
    const enviar$ = this.despachosSeleccionados().map(despacho =>
      this._despachoRepository.enviarRndc(despacho.id).pipe(
        catchError(err => {
          console.error(`Error al enviar RNDc para despacho ${despacho.id}:`, err);
          return of(null); // devolvemos algo para que forkJoin no falle
        })
      )
    );
    alert('asd');
    forkJoin(enviar$).subscribe({
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
        console.error('Error al eliminar guia:', err);
      },
    });
  }

  onSeleccionDespachos(despachos: Despacho[]) {
    this.despachosSeleccionados.set(despachos);
  }

  private actualizarPaginacion(count: number) {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      totalItems: count,
      totalPaginas: Math.ceil(count / estado.itemsPorPagina),
    }));
  }
}
