import { inject, Injectable } from '@angular/core';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar.interfece';
import { GeneralRepository } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class IdentificacionRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  identificacionSeleccionar() {
    return this._generalRepository.get<RespuestaSeleccionar[]>(
      'general/identificacion/seleccionar/'
    );
  }
}
