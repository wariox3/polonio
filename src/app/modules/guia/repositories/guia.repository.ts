import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi, QueryParams } from '@app/core/interfaces/api.interface';
import { Guia } from '../interfaces/guia.interface';
import { GuiaProcesoEntrega } from '../interfaces/guia-proceso-entrega';

@Injectable({
  providedIn: 'root',
})
export class GuiaRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<Guia>>('transporte/guia/', queryParams);
  }

  nuevo(data: Guia) {
    return this._generalRepository.create<Guia>('transporte/guia/', data);
  }

  editar(id: number, data: Guia) {
    return this._generalRepository.update<Guia>('transporte/guia/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Guia>('transporte/guia/', id);
  }

  detalleExtendido(id: number) {
    return this._generalRepository.get<RespuestaApi<Guia>>('transporte/guia/', {
      id,
      serializador: 'detalle',
    });
  }

  eliminar(id: number) {
    return this._generalRepository.delete<Guia>('transporte/guia/', id);
  }

  enviarRndc(id: number) {
    return this._generalRepository.post('transporte/guia/enviar-rndc/', { id });
  }

  entrega(data: GuiaProcesoEntrega) {
    return this._generalRepository.post('transporte/guia/entregar/', data);
  }

  descargarExcel(data: QueryParams) {
    this._generalRepository.descargarArchivos('transporte/guia/', {
      excel: 1,
      ...data,
    });
  }
}
