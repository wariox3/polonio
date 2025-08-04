import { inject, Injectable } from '@angular/core';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar.interfece';
import { GeneralRepository } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class CiudadRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  ciudadSeleccionar() {
    return this._generalRepository.get<RespuestaSeleccionar[]>('general/ciudad/seleccionar/');
  }
}
