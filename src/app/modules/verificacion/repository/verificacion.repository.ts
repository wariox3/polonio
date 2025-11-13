import { inject, Injectable, signal } from '@angular/core';
import { RespuestaApi, QueryParams } from '@app/core/interfaces/api.interface';
import { Verificacion } from '../interfaces/verificacion.interface';
import { HttpBaseRepository } from '@app/core/repository/http-base.repository';
import { FilterTransformerService } from '@app/common/components/ui/filtro/service/filter-transformer.service';
@Injectable({
  providedIn: 'root',
})
export class VerificacionRepository {
  private _httpBaseRepository = inject(HttpBaseRepository);
  private _filterTransformService = inject(FilterTransformerService);

  public totalItems = signal<number>(0);

  lista(queryParams: QueryParams) {
    const params = this._filterTransformService.toQueryString({
      ...queryParams,
    });

    return this._httpBaseRepository.get<RespuestaApi<Verificacion>>(
      '/vertical/verificacion/?' + params
    );
  }

  proceso(verificacionId: number) {
    return this._httpBaseRepository.post<any>(`/vertical/verificacion/proceso/`, {
      id: verificacionId,
    });
  }

  // const params = this._filterTransformService.toQueryString({
  //   ...queryParams,
  //   serializador: 'lista',
  //   contenedor__reddoc: 'True',
  // });

  // return this._httpBaseRepository
  //   .get<RespuestaApi<ContenedorLista>>('/contenedor/usuariocontenedor/?' + params)
  //   .pipe(
  //     map(respuesta => {
  //       this.totalItems.set(respuesta.count);

  //       return {
  //         ...respuesta,
  //         results: this._contenedorService.agregarPropiedades(respuesta.results),
  //       };
  //     })
  //   );

  // nuevo(data: Vehiculo) {
  //   return this._generalRepository.create<Vehiculo>('transporte/vehiculo/', data);
  // }

  // editar(id: number, data: Vehiculo) {
  //   return this._generalRepository.update<Vehiculo>('transporte/vehiculo/', id, data);
  // }

  // detalle(id: number) {
  //   return this._generalRepository.getById<Vehiculo>('transporte/vehiculo/', id);
  // }

  // eliminar(id: number) {
  //   return this._generalRepository.delete<Vehiculo>('transporte/vehiculo/', id);
  // }
}
