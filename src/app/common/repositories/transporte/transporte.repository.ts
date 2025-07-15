import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';

export interface respuestaSeleccionar {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root',
})
export class TransporteRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  coloresSeleccionar() {
    return this._generalRepository.get<respuestaSeleccionar[]>('transporte/color/seleccionar/');
  }

  marcaSeleccionar() {
    return this._generalRepository.get<respuestaSeleccionar[]>('transporte/marca/seleccionar/');
  }

  lineaSeleccionar() {
    return this._generalRepository.get<respuestaSeleccionar[]>('transporte/linea/seleccionar/');
  }

  combustibleSeleccionar() {
    return this._generalRepository.get<respuestaSeleccionar[]>(
      'transporte/combustible/seleccionar/'
    );
  }

  carroceriaSeleccionar() {
    return this._generalRepository.get<respuestaSeleccionar[]>(
      'transporte/carroceria/seleccionar/'
    );
  }

  vehiculoConfiguracionSeleccionar() {
    return this._generalRepository.get<respuestaSeleccionar[]>(
      'transporte/vehiculo_configuracion/seleccionar/'
    );
  }
}
