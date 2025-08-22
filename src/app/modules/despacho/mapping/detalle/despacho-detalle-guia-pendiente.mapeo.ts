import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';
import { formatearMonedaCOP } from '@app/common/utils/formatters';

export const columnasDespachoModalGuiaPendiente: ColumnaTabla[] = [
  {
    clave: 'id',
    nombre: 'ID',
    ancho: '80px',
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
    clave: 'destinatario__nombre_corto',
    nombre: 'Destinatario',
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
    clave: 'flete',
    nombre: 'Flete',
    formato: valor => formatearMonedaCOP(valor),
    alineacion: 'derecha',
  },
  {
    clave: 'manejo',
    nombre: 'Manejo',
    formato: valor => formatearMonedaCOP(valor),
    alineacion: 'derecha',
  },
];
