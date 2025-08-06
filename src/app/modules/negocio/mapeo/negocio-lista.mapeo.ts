import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';

export const columnasNegocioLista: ColumnaTabla[] = [
  {
    clave: 'id',
    nombre: 'ID',
  },
  {
    clave: 'fecha',
    nombre: 'Fecha',
  },
  {
    clave: 'contacto__nombre_corto',
    nombre: 'Contacto',
  },
  {
    clave: 'ciudad_origen__nombre',
    nombre: 'Ciudad Origen',
  },
  {
    clave: 'ciudad_destino__nombre',
    nombre: 'Ciudad Destino',
  },
  {
    clave: 'unidades',
    nombre: 'Unidades',
  },
  {
    clave: 'peso',
    nombre: 'Peso',
  },
  {
    clave: 'volumen',
    nombre: 'Volumen',
  },
  {
    clave: 'declara',
    nombre: 'Declara',
  },
  {
    clave: 'pago',
    nombre: 'Pago',
  },
  {
    clave: 'flete',
    nombre: 'Flete',
  },
  {
    clave: 'manejo',
    nombre: 'Manejo',
  },
];
