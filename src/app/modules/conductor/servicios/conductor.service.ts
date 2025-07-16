import { inject, Injectable, signal } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi } from '@app/core/interfaces/api.interface';
import { tap } from 'rxjs';
import { Conductor } from '../interfaces/conductor';

@Injectable({
  providedIn: 'root',
})
export class ConductorService {
  private _generalRepository = inject(GeneralRepository);
  public arrConductorsSignal = signal<Conductor[]>([]);

  constructor() {}

  lista() {
    return this._generalRepository
      .get<RespuestaApi<Conductor>>('transporte/conductor/')
      .pipe(tap(respuesta => this.arrConductorsSignal.set(respuesta.results)));
  }

  nuevo(data: Conductor) {
    return this._generalRepository.create<Conductor>('transporte/conductor/', data);
  }

  editar(id: number, data: Conductor) {
    return this._generalRepository.update<Conductor>('transporte/conductor/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Conductor>('transporte/conductor/', id);
  }
}
