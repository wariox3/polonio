import { Contacto } from '@app/modules/contacto/interfaces/contacto.interface';

export interface Conductor extends Contacto {
  numero_licencia: string;
  categoria_licencia_id: number | null;
  categoria_licencia_nombre: string | null;
  fecha_vence_licencia: string;
}
