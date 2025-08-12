import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi, QueryParams } from '@app/core/interfaces/api.interface';
import { Negocio } from '../interfaces/negocio.interface';

@Injectable({
  providedIn: 'root',
})
export class NegocioRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() { }

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<Negocio>>('transporte/negocio/', queryParams);
  }

  nuevo(data: Negocio) {
    return this._generalRepository.create<Negocio>('transporte/negocio/', data);
  }

  editar(id: number, data: Negocio) {
    return this._generalRepository.update<Negocio>('transporte/negocio/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Negocio>('transporte/negocio/', id);
  }

  eliminar(id: number) {
    return this._generalRepository.delete<Negocio>('transporte/negocio/', id);
  }

  descargarExcel(data: QueryParams) {
    this._generalRepository.descargarArchivos('transporte/negocio/', {
      excel: 1,
      ...data,
    });
  }
}
