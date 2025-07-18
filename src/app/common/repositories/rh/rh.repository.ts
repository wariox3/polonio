import { inject, Injectable } from '@angular/core';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar.interfece';
import { GeneralRepository } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class RhRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  rhSeleccionar() {
    return this._generalRepository.get<RespuestaSeleccionar[]>('general/rh/seleccionar/');
  }
}
