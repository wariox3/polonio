import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi, QueryParams } from '@app/core/interfaces/api.interface';
import { Ruta } from '../interfaces/ruta.interface';

@Injectable({
  providedIn: 'root',
})
export class RutaRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() { }

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<Ruta>>('transporte/ruta/', queryParams);
  }

  nuevo(data: Ruta) {
    return this._generalRepository.create<Ruta>('transporte/ruta/', data);
  }

  editar(id: number, data: Ruta) {
    return this._generalRepository.update<Ruta>('transporte/ruta/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Ruta>('transporte/ruta/', id);
  }

  eliminar(id: number) {
    return this._generalRepository.delete<Ruta>('transporte/ruta/', id);
  }
}
