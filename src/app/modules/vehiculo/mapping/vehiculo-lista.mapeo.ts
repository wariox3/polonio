import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';

export const columnasVehiculoLista: ColumnaTabla[] = [
  { clave: 'id', nombre: 'Id' },
  { clave: 'placa', nombre: 'Placa' },
  { clave: 'marca__nombre', nombre: 'Marca' },
  { clave: 'modelo', nombre: 'Modelo' },
  { clave: 'celular', nombre: 'Celular' },
  {
    clave: 'poseedor__nombre_corto',
    nombre: 'Poseedor',
  },
  {
    clave: 'estado_revisado',
    nombre: 'Revisado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_inactivo',
    nombre: 'Inactivo',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
];
