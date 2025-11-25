import { Conductor } from './conductor.interface';

export interface ValidarNumeroIdentificacion {
  validacion: boolean;
  codigo: number;
  contacto: Conductor;
}
