export interface TteVehiculo {
  id: number;
  fecha_registro: string;
  placa: string;
  modelo: number;
  modelo_repotenciado?: number | null;
  motor?: string | null;
  chasis?: string | null;
  ejes: number;
  peso_vacio: number;
  capacidad: number;
  celular?: string | null;
  poliza?: string | null;
  vence_poliza: string | Date; // DateField
  tecnicomecanica?: string | null;
  vence_tecnicomecanica: string | Date;
  propio: boolean;
  remolque: boolean;
  estado_inactivo: boolean;
  estado_revisado: boolean;
  comentario?: string | null;
}
