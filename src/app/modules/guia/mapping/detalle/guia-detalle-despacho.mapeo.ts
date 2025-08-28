import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';
import { formatearFechaISO } from '@app/common/utils/formatters';

export const columnasGuiaDespacho: ColumnaTabla[] = [
  {
    clave: 'id',
    nombre: 'Id',
    ancho: '80px',
  },
  {
    clave: 'despacho_id',
    nombre: 'Despacho',
  },
  {
    clave: 'despacho__servicio__nombre',
    nombre: 'Servicio',
  },
  {
    clave: 'despacho__fecha',
    nombre: 'Fecha',
    formato: valor => formatearFechaISO(valor),
  },
  {
    clave: 'despacho__vehiculo__placa',
    nombre: 'Vehículo',
  },
  {
    clave: 'despacho__conductor__nombre_corto',
    nombre: 'Conductor',
  },
  {
    clave: 'despacho__ciudad_origen__nombre',
    nombre: 'Origen',
  },
  {
    clave: 'despacho__ciudad_destino__nombre',
    nombre: 'Destino',
  },
  {
    clave: 'despacho__estado_aprobado',
    nombre: 'Aprobado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
];
