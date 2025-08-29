export interface Negocio {
  id: number;
  fecha: string;
  unidades: number;
  peso: number;
  volumen: number;
  declara: number;
  pago: number;
  flete: number;
  manejo: number;
  comentario: string;
  contacto: number;
  contacto__nombre_corto?: string;
  ciudad_origen: number;
  ciudad_origen__nombre?: string;
  ciudad_destino: number;
  ciudad_destino__nombre?: string;
  publicar: boolean;
}
