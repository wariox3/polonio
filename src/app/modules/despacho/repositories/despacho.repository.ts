import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi, QueryParams } from '@app/core/interfaces/api.interface';
import { Despacho } from '../interfaces/despacho.interface';

@Injectable({
  providedIn: 'root',
})
export class DespachoRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<Despacho>>('transporte/despacho/', queryParams);
  }

  nuevo(data: Despacho) {
    return this._generalRepository.create<Despacho>('transporte/despacho/', data);
  }

  editar(id: number, data: Despacho) {
    return this._generalRepository.update<Despacho>('transporte/despacho/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Despacho>('transporte/despacho/', id);
  }

  eliminar(id: number) {
    return this._generalRepository.delete<Despacho>('transporte/despacho/', id);
  }

  aprobar(id: number) {
    return this._generalRepository.post<Despacho>('transporte/despacho/aprobar/', { id });
  }

  enviarRndc(id: number) {
    return this._generalRepository.post('transporte/despacho/enviar-rndc/', { id });
  }

  imprimir(despacho_id: number) {
    return this._generalRepository.descargarArchivosPost('transporte/despacho/imprimir/', {
      despacho_id,
    });
  }

  imprimirManifiesto(despacho_id: number) {
    return this._generalRepository.descargarArchivosPost(
      'transporte/despacho/imprimir-manifiesto/',
      {
        despacho_id,
      }
    );
  }

  descargarExcel(data: QueryParams) {
    this._generalRepository.descargarArchivos('transporte/despacho/', {
      excel: 1,
      ...data,
    });
  }
}
