import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuesta-seleccionar';

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
