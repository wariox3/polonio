import { inject, Injectable } from '@angular/core';
import { RespuestaSeleccionar } from '@app/common/interfaces/respuestaSeleccionar';
import { GeneralRepository } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class TransporteRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  coloresSeleccionar() {
    return this._generalRepository.get<RespuestaSeleccionar[]>('transporte/color/seleccionar/');
  }

  marcaSeleccionar() {
    return this._generalRepository.get<RespuestaSeleccionar[]>('transporte/marca/seleccionar/');
  }

  lineaSeleccionar() {
    return this._generalRepository.get<RespuestaSeleccionar[]>('transporte/linea/seleccionar/');
  }

  combustibleSeleccionar() {
    return this._generalRepository.get<RespuestaSeleccionar[]>(
      'transporte/combustible/seleccionar/'
    );
  }

  carroceriaSeleccionar() {
    return this._generalRepository.get<RespuestaSeleccionar[]>(
      'transporte/carroceria/seleccionar/'
    );
  }

  vehiculoConfiguracionSeleccionar() {
    return this._generalRepository.get<RespuestaSeleccionar[]>(
      'transporte/vehiculo_configuracion/seleccionar/'
    );
  }
}
