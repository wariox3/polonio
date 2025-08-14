export interface Despacho {
  id: number;
  despacho_tipo: number;
  despacho_tipo__nombre?: string;
  vehiculo: number;
  vehiculo__placa?: string;
  remolque: number;
  remolque__placa?: string;
  conductor: number;
  conductor__nombre_corto?: string;
  ciudad_origen: number;
  ciudad_origen__nombre?: string;
  ciudad_destino: number;
  ciudad_destino__nombre?: string;
  pago: number;
  comentario: string;
  ruta: number;
  ruta__nombre?: string;
  operacion: number;
  operacion__nombre?: string;
  flete: number;
}
