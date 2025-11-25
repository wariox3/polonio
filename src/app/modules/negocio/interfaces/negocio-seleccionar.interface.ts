export interface NegocioSeleccionar {
  id: number;
  nombre: string;
  fecha: string;
  unidades: number;
  peso: number;
  volumen: number;
  declara: number;
  flete: number;
  manejo: number;
  ciudad_destino_id: number;
  ciudad_destino__nombre?: string;
  destinatario_nombre?: string;
  destinatario_direccion?: string;
  destinatario_telefono?: string;
  destinatario_correo?: string;
}
