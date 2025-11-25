import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { QueryParams, RespuestaApi } from '@app/core/interfaces/api.interface';
import { GuiaDetalle } from '../interfaces/detalle/guia-detalle-.interface';

@Injectable({
  providedIn: 'root',
})
export class GuiaDetalleRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<GuiaDetalle>>(
      'transporte/despacho_detalle/',
      queryParams
    );
  }
}
