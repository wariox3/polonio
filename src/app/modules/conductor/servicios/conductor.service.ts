import { inject, Injectable, signal } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi } from '@app/core/interfaces/api.interface';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConductorService {
  private _generalRepository = inject(GeneralRepository);
  public arrConductoresSignal = signal<any[]>([]);

  constructor() {}

  lista() {
    return this._generalRepository
      .get<RespuestaApi<any>>('transporte/conductor/')
      .pipe(tap(respuesta => this.arrConductoresSignal.set(respuesta.results)));
  }
}
