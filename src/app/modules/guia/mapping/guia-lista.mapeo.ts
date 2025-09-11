import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';
import { formatearFechaISO } from '@app/common/utils/formatters';

export const columnasGuiaLista: ColumnaTabla[] = [
  { clave: 'id', nombre: 'Id' },
  { clave: 'operacion_ingreso__nombre', nombre: 'OI', tooltip: 'Operación ingreso' },
  { clave: 'operacion_cargo__nombre', nombre: 'OC', tooltip: 'Operación cargo' },
  { clave: 'servicio__nombre', nombre: 'Servicio' },
  { clave: 'fecha', nombre: 'Fecha', formato: valor => formatearFechaISO(valor) },
  { clave: 'contacto__nombre_corto', nombre: 'Cliente' },
  { clave: 'ciudad_origen__nombre', nombre: 'Origen' },
  { clave: 'ciudad_destino__nombre', nombre: 'Destino' },
  { clave: 'unidades', nombre: 'Unidades' },
  { clave: 'peso', nombre: 'Peso' },
  { clave: 'volumen', nombre: 'Volumen' },
  {
    clave: 'estado_despachado',
    nombre: 'D',
    tooltip: 'Despachado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_entregado',
    nombre: 'E',
    tooltip: 'Entregado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_soporte',
    nombre: 'S',
    tooltip: 'Soporte',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_novedad',
    nombre: 'N',
    tooltip: 'Novedad',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
];

export const columnasGuiaProcesoEntrega: ColumnaTabla[] = [
  { clave: 'id', nombre: 'Id' },
  { clave: 'operacion_ingreso__nombre', nombre: 'OI', tooltip: 'Operación ingreso' },
  { clave: 'operacion_cargo__nombre', nombre: 'OC', tooltip: 'Operación cargo' },
  { clave: 'fecha', nombre: 'Fecha', formato: valor => formatearFechaISO(valor) },
  { clave: 'documento_cliente', nombre: 'DOC_CLIENTE' },
  { clave: 'despacho_codigo', nombre: 'DES' },
  {
    clave: 'despacho_fecha',
    nombre: 'F_DESP',
    tooltip: 'Fecha despacho',
    formato: valor => formatearFechaISO(valor),
  },
  { clave: 'contacto__nombre_corto', nombre: 'Cliente' },
  { clave: 'ciudad_destino__nombre', nombre: 'Destino' },
  { clave: 'unidades', nombre: 'Unidades' },
  { clave: 'peso', nombre: 'Peso' },
  { clave: 'volumen', nombre: 'Volumen' },
  {
    clave: 'fecha',
    nombre: 'Fecha',
    tooltip: 'Fecha despacho',
    formato: valor => formatearFechaISO(valor),
  },
  {
    clave: 'hora',
    nombre: 'Hora',
    tooltip: 'Hora despacho',
    formato: valor => formatearFechaISO(valor),
  },
  {
    clave: 'estado_novedad',
    nombre: 'N',
    tooltip: 'Novedad',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_novedad_solucion',
    nombre: 'N_S',
    tooltip: 'Estado novedad solucionado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_digitalizado',
    nombre: 'DIG',
    tooltip: 'Estado digitalizado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_firma',
    nombre: 'FIR',
    tooltip: 'Estado firma',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
];
