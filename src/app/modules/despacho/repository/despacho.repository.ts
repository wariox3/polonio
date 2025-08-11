import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi, QueryParams } from '@app/core/interfaces/api.interface';
import { Despacho } from '../interfaces/despacho.interface';

@Injectable({
  providedIn: 'root',
})
export class DespachoRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<Despacho>>('ruteo/despacho/', queryParams);
  }

  nuevo(data: Despacho) {
    return this._generalRepository.create<Despacho>('ruteo/despacho/', data);
  }

  editar(id: number, data: Despacho) {
    return this._generalRepository.update<Despacho>('ruteo/despacho/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Despacho>('ruteo/despacho/', id);
  }

  eliminar(id: number) {
    return this._generalRepository.delete<Despacho>('ruteo/despacho/', id);
  }
}
