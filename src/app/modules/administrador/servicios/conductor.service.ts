import { inject, Injectable, signal } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { API_ENDPOINTS } from '@app/core/constants/api-endpoints.const';
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
      .get(API_ENDPOINTS.VEHICULO.LISTA)
      .pipe(tap(respuesta => this.arrConductoresSignal.set(respuesta.results)));
  }
}
