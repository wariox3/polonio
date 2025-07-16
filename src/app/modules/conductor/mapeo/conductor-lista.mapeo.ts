import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';

export const columnasConductorLista: ColumnaTabla[] = [
  { clave: 'id', nombre: 'ID' },
  { clave: 'nombre_corto', nombre: 'Nombre' },
  { clave: 'numero_identificacion', nombre: 'Identificación' },
  { clave: 'telefono', nombre: 'Teléfono' },
  { clave: 'celular', nombre: 'Celular' },
  { clave: 'correo', nombre: 'Correo' },
  { clave: 'numero_licencia', nombre: 'Licencia' },
  { clave: 'categoria_licencia', nombre: 'Categoría' },
  { clave: 'fecha_vence_licencia', nombre: 'Vence licencia' },
  {
    clave: 'propio',
    nombre: 'Propio',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_inactivo',
    nombre: 'Inactivo',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_revisado',
    nombre: 'Revisado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
];
