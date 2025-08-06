import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi, QueryParams } from '@app/core/interfaces/api.interface';
import { Conductor } from '../interfaces/conductor.interface';

@Injectable({
  providedIn: 'root',
})
export class ConductorRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<Conductor>>(
      'transporte/conductor/',
      queryParams
    );
  }

  nuevo(data: Conductor) {
    return this._generalRepository.create<Conductor>('transporte/conductor/', data);
  }

  editar(id: number, data: Conductor) {
    return this._generalRepository.update<Conductor>('transporte/conductor/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Conductor>('transporte/conductor/', id);
  }

  eliminar(id: number) {
    return this._generalRepository.delete('transporte/conductor/', id);
  }
}
