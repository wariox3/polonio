import { Component, inject, signal, OnInit } from '@angular/core';
import { FiltroComponent } from '@app/common/components/ui/filtro/filtro.component';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';
import { TablaComponent } from '@app/common/components/ui/tablas/tabla/tabla.component';
import { EstadoPaginacion } from '@app/common/interfaces/paginacion.interface';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { GUIA_LISTA_FILTERS } from '@app/modules/guia/mapping/guia-filtros.mapeo';
import { GuiaRepository } from '@app/modules/guia/repositories/guia.repository';
import { columnasGuiaLista } from '@app/modules/guia/mapping/guia-lista.mapeo';
import { Guia } from '@app/modules/guia/interfaces/guia.interface';

@Component({
  selector: 'app-guia-pendiente-despacho',
  standalone: true,
  imports: [FiltroComponent, PaginadorComponent, TablaComponent],
  templateUrl: './guia-pendiente-despacho.component.html',
})
export default class GuiaPendienteDespachoComponent implements OnInit {
  private readonly parametrosBase = {
    serializador: 'lista',
    estado_despachado: 'False',
  };
  private _guiaRepository = inject(GuiaRepository);
  private filtrosActivos = signal<QueryParams>(this.parametrosBase);
  public camposFiltros = GUIA_LISTA_FILTERS;
  public columnas = columnasGuiaLista;
  public guias = signal<Guia[]>([]);
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
      console.log(respuesta);
      this.guias.set(respuesta.results);
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

  exportarExcel() {
    this._guiaRepository.descargarExcel(this.filtrosActivos());
  }

  private actualizarPaginacion(count: number) {
    this.estadoPaginacion.update(estado => ({
      ...estado,
      totalItems: count,
      totalPaginas: Math.ceil(count / estado.itemsPorPagina),
    }));
  }
}
