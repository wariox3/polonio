export interface DespachoDetalle {
  id: number;
  fecha_registro: string;
  unidades: number;
  peso: number;
  volumen: number;
  peso_facturado: number;
  costo: number;
  declara: number;
  flete: number;
  manejo: number;
  recaudo: number;
  cobro_entrega: number;
  despacho: number;
  guia: number;
  guia__ciudad_destino__nombre: string;
  guia__destinatario__nombre_corto: string;
}
