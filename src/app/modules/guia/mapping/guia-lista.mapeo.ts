import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';

export const columnasGuiaLista: ColumnaTabla[] = [
  { clave: 'id', nombre: 'Id' },
  { clave: 'operacion_ingreso__nombre', nombre: 'Ingreso' },
  { clave: 'operacion_cargo__nombre', nombre: 'Cargo' },
  { clave: 'servicio__nombre', nombre: 'Servicio' },
  { clave: 'fecha', nombre: 'Fecha' },
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
    tooltip: 'Soporte',
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
