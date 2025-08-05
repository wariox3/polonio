import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi } from '@app/core/interfaces/api.interface';
import { Vehiculo } from '../interfaces/vehiculo.interface';

@Injectable({
  providedIn: 'root',
})
export class VehiculoRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  lista() {
    return this._generalRepository.get<RespuestaApi<Vehiculo>>('transporte/vehiculo/');
  }

  nuevo(data: Vehiculo) {
    return this._generalRepository.create<Vehiculo>('transporte/vehiculo/', data);
  }

  editar(id: number, data: Vehiculo) {
    return this._generalRepository.update<Vehiculo>('transporte/vehiculo/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Vehiculo>('transporte/vehiculo/', id);
  }

  eliminar(id: number) {
    return this._generalRepository.delete<Vehiculo>('transporte/vehiculo/', id);
  }
}
