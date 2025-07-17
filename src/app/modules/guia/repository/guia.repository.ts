import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi } from '@app/core/interfaces/api.interface';
import { Guia } from '../interfaces/guia.interface';

@Injectable({
  providedIn: 'root',
})
export class GuiaRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  lista() {
    return this._generalRepository.get<RespuestaApi<Guia>>('transporte/guia/');
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

  eliminar(id: number) {
    return this._generalRepository.delete<Guia>('transporte/guia/', id);
  }
}
