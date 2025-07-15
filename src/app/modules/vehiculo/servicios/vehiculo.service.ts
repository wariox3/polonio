import { inject, Injectable, signal } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { API_ENDPOINTS } from '@app/core/constants/api-endpoints.const';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private _generalRepository = inject(GeneralRepository);
  public arrVehiculosSignal = signal<any[]>([]);

  constructor() {}

  lista() {
    return this._generalRepository
      .get(API_ENDPOINTS.VEHICULO.LISTA)
      .pipe(tap(respuesta => this.arrVehiculosSignal.set(respuesta.results)));
  }

  nuevo(data: any) {
    return this._generalRepository.create(API_ENDPOINTS.VEHICULO.LISTA, data).pipe(
      tap(respuesta => {
        console.log(respuesta);
      })
    );
  }
}
