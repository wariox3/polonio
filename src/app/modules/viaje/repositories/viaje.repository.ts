import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { PropuestaAdicionar, ViajeLista } from '../interfaces/viaje.interface';

@Injectable({
  providedIn: 'root',
})
export class ViajeRepository {
  private _generalRepository = inject(GeneralRepository);

  getViajes(parametros?: QueryParams) {
    return this._generalRepository.get<ViajeLista>('vertical/viaje/lista/', parametros);
  }

  agregarPropuesta(propuesta: PropuestaAdicionar) {
    return this._generalRepository.post<any>('vertical/propuesta/adicionar-propuesta/', propuesta);
  }
}
