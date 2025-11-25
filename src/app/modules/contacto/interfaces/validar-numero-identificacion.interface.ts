import { Contacto } from './contacto.interface';

export interface ValidarNumeroIdentificacion {
  validacion: boolean;
  codigo: number;
  contacto: Contacto;
}
