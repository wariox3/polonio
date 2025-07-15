import { inject, Injectable, signal } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi } from '@app/core/interfaces/api.interface';
import { tap } from 'rxjs';
import { Vehiculo } from '../interfaces/vehiculo.interfeces';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private _generalRepository = inject(GeneralRepository);
  public arrVehiculosSignal = signal<Vehiculo[]>([]);

  constructor() {}

  lista() {
    return this._generalRepository
      .get<RespuestaApi<Vehiculo>>('transporte/vehiculo/')
      .pipe(tap(respuesta => this.arrVehiculosSignal.set(respuesta.results)));
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
}
