export interface Verificacion {
  id: number;
  fecha_registro: string;
  verificador: string;
  vehiculo_placa: string;
  usuario_id: string;
  fecha_verificacion: string;
  fecha_verificacion_vence: string;
  verificado: boolean;
  estado_procesado: boolean;
}
