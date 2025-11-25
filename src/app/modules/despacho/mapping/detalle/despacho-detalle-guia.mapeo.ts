import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';
import { formatearFechaISO, formatearMonedaCOP } from '@app/common/utils/formatters';

export const columnasDespachoGuia: ColumnaTabla[] = [
  {
    clave: 'id',
    nombre: 'Id',
    ancho: '80px',
  },
  {
    clave: 'guia',
    nombre: 'Guía',
  },
  {
    clave: 'guia__fecha',
    nombre: 'Fecha',
    formato: valor => formatearFechaISO(valor),
  },
  {
    clave: 'guia__cliente__nombre_corto',
    nombre: 'Cliente',
  },
  {
    clave: 'guia__ciudad_destino__nombre',
    nombre: 'Destino',
  },
  {
    clave: 'cobro_entrega',
    nombre: 'Cobro entrega',
    formato: valor => formatearMonedaCOP(valor),
    alineacion: 'derecha',
  },
  {
    clave: 'unidades',
    nombre: 'Und',
    tooltip: 'Unidades',
  },
  {
    clave: 'peso',
    nombre: 'Pes',
    tooltip: 'Peso',
  },
  {
    clave: 'volumen',
    nombre: 'Vol',
    tooltip: 'Volumen',
  },
  {
    clave: 'estado_entregado',
    nombre: 'E',
    tooltip: 'Entregado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
];
