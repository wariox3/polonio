import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class ContactoRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

  contacto() {
    return this._generalRepository.get<any>('general/contacto/');
  }

  cliente() {
    return this._generalRepository.get<any>('general/contacto/');
  }

  destinatario() {
    return this._generalRepository.get<any>('general/contacto/');
  }

  poseedor() {
    return this._generalRepository.get<any>('general/contacto/');
  }

  propietario() {
    return this._generalRepository.get<any>('general/contacto/');
  }

  aseguradora() {
    return this._generalRepository.get<any>('general/contacto/');
  }
}
