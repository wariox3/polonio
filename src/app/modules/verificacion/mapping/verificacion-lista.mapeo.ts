import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';
import { formatearFechaISO } from '@app/common/utils/formatters';

export const columnasVerificacionLista: ColumnaTabla[] = [
  { clave: 'id', nombre: 'Id' },
  { clave: 'fecha_registro', nombre: 'Fecha registro', formato: valor => formatearFechaISO(valor) },
  { clave: 'vehiculo__placa', nombre: 'Placa' },
  { clave: 'conductor__numero_identificacion', nombre: 'Identificación' },
  { clave: 'conductor__nombre_corto', nombre: 'Conductor' },
  // { clave: 'marca__nombre', nombre: 'Marca' },
  // { clave: 'modelo', nombre: 'Modelo' },
  // { clave: 'celular', nombre: 'Celular' },
  // {
  //   clave: 'poseedor__nombre_corto',
  //   nombre: 'Poseedor',
  // },
  // {
  //   clave: 'estado_revisado',
  //   nombre: 'Revisado',
  //   formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  // },
  {
    clave: 'estado_proceso',
    nombre: 'Proceso',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'verificado',
    nombre: 'Verificado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
];
