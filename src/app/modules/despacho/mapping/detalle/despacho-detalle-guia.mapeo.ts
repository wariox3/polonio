import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';
import { formatearFechaISO, formatearMonedaCOP } from '@app/common/utils/formatters';

export const columnasDespachoGuia: ColumnaTabla[] = [
  {
    clave: 'id',
    nombre: 'Id',
    ancho: '80px',
  },
  {
    clave: 'fecha_registro',
    nombre: 'Fecha',
    formato: valor => formatearFechaISO(valor),
  },
  {
    clave: 'guia',
    nombre: 'Guía',
  },
  {
    clave: 'guia__destinatario__nombre_corto',
    nombre: 'Destinatario',
  },
  {
    clave: 'guia__ciudad_destino__nombre',
    nombre: 'Destino',
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
  {
    clave: 'declara',
    nombre: 'Declarado',
    formato: valor => formatearMonedaCOP(valor),
    alineacion: 'derecha',
  },
  {
    clave: 'cobro_entrega',
    nombre: 'Cobro entrega',
    formato: valor => formatearMonedaCOP(valor),
    alineacion: 'derecha',
  },
  {
    clave: 'recaudo',
    nombre: 'Rec',
    tooltip: 'Recaudo',
    formato: valor => formatearMonedaCOP(valor),
    alineacion: 'derecha',
  },
  {
    clave: 'costo',
    nombre: 'Costo',
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
    tooltip: 'Peso Unidades',
  },
  {
    clave: 'volumen',
    nombre: 'Vol',
    tooltip: 'Volumen',
  },
  {
    clave: 'peso_facturado',
    nombre: 'Pes fac',
    tooltip: 'Peso Facturado',
  },
];
