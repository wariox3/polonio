import { inject, Injectable, signal } from '@angular/core';
import { API_ENDPOINTS } from '@app/core/constants/api-endpoints.const';
import { GeneralApiService } from '@app/core/services/general.service';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VehiculoService {
  private _generalService = inject(GeneralApiService);
  public arrVehiculosSignal = signal<any[]>([]);

  constructor() {}

  lista() {
    return this._generalService
      .consultaApi(API_ENDPOINTS.VEHICULO.LISTA)
      .pipe(tap(respuesta => this.arrVehiculosSignal.set(respuesta.results)));
  }
}
