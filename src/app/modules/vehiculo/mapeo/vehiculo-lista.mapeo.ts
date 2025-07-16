import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';

export const columnasVehiculoLista: ColumnaTabla[] = [
  { clave: 'id', nombre: 'ID' },
  { clave: 'placa', nombre: 'Placa' },
  { clave: 'marca__nombre', nombre: 'Marca' },
  { clave: 'modelo', nombre: 'Modelo' },
  { clave: 'motor', nombre: 'Motor' },
  { clave: 'chasis', nombre: 'Chasis' },
  { clave: 'ejes', nombre: 'Ejes' },
  { clave: 'celular', nombre: 'Celular' },
  { clave: 'poliza', nombre: 'Póliza' },
  { clave: 'vence_poliza', nombre: 'Vence Póliza' },
  { clave: 'tecnicomecanica', nombre: 'Tecnomecánica' },
  { clave: 'vence_tecnicomecanica', nombre: 'Vence Tecnomecánica' },
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
