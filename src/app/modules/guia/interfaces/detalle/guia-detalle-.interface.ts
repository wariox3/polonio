export interface GuiaDetalle {
  id: number;
  despacho_id: number;
  despacho__fecha: string;
  despacho__servicio__nombre: string;
  despacho__vehiculo__placa: string;
  despacho__conductor__nombre_corto: string;
  despacho__ciudad_origen__nombre: string;
  despacho__ciudad_destino__nombre: string;
  despacho__estado_aprobado: string;
}
