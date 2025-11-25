import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';
import { Contacto } from '../interfaces/contacto.interface';
import { ValidarNumeroIdentificacion } from '../interfaces/validar-numero-identificacion.interface';
import { QueryParams, RespuestaApi } from '@app/core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class ContactoRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  lista(queryParams: QueryParams = {}) {
    return this._generalRepository.get<RespuestaApi<Contacto>>('general/contacto/', queryParams);
  }

  nuevo(data: Contacto) {
    return this._generalRepository.create<Contacto>('general/contacto/', data);
  }

  editar(id: number, data: Contacto) {
    return this._generalRepository.update<Contacto>('general/contacto/', id, data);
  }

  detalle(id: number) {
    return this._generalRepository.getById<Contacto>('general/contacto/', id);
  }

  eliminar(id: number) {
    return this._generalRepository.delete('general/contacto/', id);
  }

  validarNumeroIdentificacion(data: { identificacion_id: number; numero_identificacion: string }) {
    return this._generalRepository.post<ValidarNumeroIdentificacion>(
      `general/contacto/validar/`,
      data
    );
  }
}
