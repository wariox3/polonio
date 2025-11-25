import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi, QueryParams } from '@app/core/interfaces/api.interface';
import { DespachoDetalle } from '../interfaces/despacho-detalle/despacho-detalle.interface';

@Injectable({
  providedIn: 'root',
})
export class DespachoDetalleRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<DespachoDetalle>>(
      'transporte/despacho_detalle/',
      queryParams
    );
  }

  nuevo(data: { id: number; guia_id: number | string }) {
    return this._generalRepository.create<DespachoDetalle>(
      'transporte/despacho/adicionar-guia/',
      data
    );
  }

  eliminar(data: { id: number }) {
    return this._generalRepository.post<DespachoDetalle>(
      'transporte/despacho_detalle/eliminar/',
      data
    );
  }
}
