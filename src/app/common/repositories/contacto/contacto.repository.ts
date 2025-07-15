import { inject, Injectable } from '@angular/core';
import { GeneralRepository } from '@app/core';

@Injectable({
  providedIn: 'root',
})
export class ContactoRepository {
  private _generalRepository = inject(GeneralRepository);

  constructor() {}

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
