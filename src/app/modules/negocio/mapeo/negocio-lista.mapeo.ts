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
    nombre: 'Origen',
  },
  {
    clave: 'ciudad_destino__nombre',
    nombre: 'Destino',
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
    nombre: 'Declarado',
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
