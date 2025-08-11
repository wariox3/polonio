import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class OperacionRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  consultaOperacionIngreso() {
    return this._generalRepository.get<any>('transporte/operacion/seleccionar', {
      id: 1,
    });
  }
}
