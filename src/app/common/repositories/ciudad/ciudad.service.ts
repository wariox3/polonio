import { inject, Injectable } from '@angular/core';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuestaSeleccionar';
import { GeneralRepository } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class CiudadService {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  ciudadSeleccionar() {
    return this._generalRepository.get<RespuestaSeleccionar[]>('general/ciudad/seleccionar/');
  }
}
