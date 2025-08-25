import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';

export const columnasConductorLista: ColumnaTabla[] = [
  { clave: 'id', nombre: 'Id' },
  { clave: 'numero_identificacion', nombre: 'Identificación' },
  { clave: 'nombre_corto', nombre: 'Nombre' },
  { clave: 'telefono', nombre: 'Teléfono' },
  { clave: 'celular', nombre: 'Celular' },
  { clave: 'correo', nombre: 'Correo' },
  { clave: 'numero_licencia', nombre: 'Licencia' },
  { clave: 'categoria_licencia__nombre', nombre: 'Categoría' },
  { clave: 'fecha_vence_licencia', nombre: 'Vence licencia' },
];
