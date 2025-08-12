import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';
import { formatearMonedaCOP } from '@app/common/utils/formatters';

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
    formato: valor => formatearMonedaCOP(valor),
  },
  {
    clave: 'pago',
    nombre: 'Pago',
    formato: valor => formatearMonedaCOP(valor),
  },
  {
    clave: 'flete',
    nombre: 'Flete',
    formato: valor => formatearMonedaCOP(valor),
  },
  {
    clave: 'manejo',
    nombre: 'Manejo',
    formato: valor => formatearMonedaCOP(valor),
  },
];
