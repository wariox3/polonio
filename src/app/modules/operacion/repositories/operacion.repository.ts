import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { QueryParams, RespuestaApi } from '@app/core/interfaces/api.interface';
import { Operacion } from '../interfaces/operacion.interface';

@Injectable({
  providedIn: 'root',
})
export class OperacionRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<Operacion>>(
      'transporte/operacion/',
      queryParams
    );
  }

  nuevo(data: Operacion) {
    return this._generalRepository.create<Operacion>('transporte/operacion/', data);
  }

  editar(id: number, data: Operacion) {
    return this._generalRepository.update<Operacion>('transporte/operacion/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Operacion>('transporte/operacion/', id);
  }

  eliminar(id: number) {
    return this._generalRepository.delete<Operacion>('transporte/operacion/', id);
  }

  consultaOperacionIngreso(id: number) {
    return this._generalRepository.get<RespuestaApi<Operacion>>('transporte/operacion/', { id });
  }
}
