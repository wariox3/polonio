import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { RespuestaApi, QueryParams } from '@app/core/interfaces/api.interface';
import { Conductor } from '../interfaces/conductor.interface';

@Injectable({
  providedIn: 'root',
})
export class ConductorRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() { }

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<Conductor>>('general/contacto/', queryParams);
  }

  nuevo(data: Conductor) {
    return this._generalRepository.create<Conductor>('general/contacto/', data);
  }

  editar(id: number, data: Conductor) {
    return this._generalRepository.update<Conductor>('general/contacto/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Conductor>('general/contacto/', id);
  }

  eliminar(id: number) {
    return this._generalRepository.delete('general/contacto/', id);
  }

  validarNumeroIdentificacion(data: { identificacion_id: number; numero_identificacion: string }) {
    return this._generalRepository.post<{ validacion: boolean; codigo: number }>(
      `general/contacto/validar/`,
      data
    );
  }
}
