import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';

export const columnasGuiaLista: ColumnaTabla[] = [
  { clave: 'id', nombre: 'ID' },
  { clave: 'operacion_ingreso', nombre: 'Ingreso' },
  { clave: 'operacion_ingreso__nombre', nombre: 'Nombre' },
  { clave: 'operacion_cargo', nombre: 'Cargo' },
  { clave: 'operacion_cargo__nombre', nombre: 'Nombre' },
  { clave: 'servicio', nombre: 'Servicio' },
  { clave: 'fecha_ingreso', nombre: 'Ingreso' },
  { clave: 'contacto__nombre_corto', nombre: 'Contacto' },
  { clave: 'ciudad_origen__nombre', nombre: 'Origen' },
  { clave: 'ciudad_destino__nombre', nombre: 'Destino' },
  { clave: 'unidades', nombre: 'Unidades' },
  { clave: 'peso', nombre: 'Peso' },
  { clave: 'volumen', nombre: 'Volumen' },
  {
    clave: 'flete',
    nombre: 'Flete',
    formato: (valor: number) => valor.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  },
  {
    clave: 'manejo',
    nombre: 'Manejo',
    formato: (valor: number) => valor.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  },
  {
    clave: 'total',
    nombre: 'Total',
    formato: (valor: number) => valor.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  },
  {
    clave: 'recaudo',
    nombre: 'Recaudo',
    formato: (valor: number) => valor.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ','),
  },
  {
    clave: 'despacho',
    nombre: 'Despacho',
  },
  {
    clave: 'estado_embarcado',
    nombre: 'Embarcado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_despachado',
    nombre: 'Despachado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_entregado',
    nombre: 'Entregado',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_soporte',
    nombre: 'Soporte',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
  {
    clave: 'estado_novedad',
    nombre: 'Novedad',
    formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
  },
];
