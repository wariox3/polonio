import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';
import { formatearFechaISO, formatearMonedaCOP } from '@app/common/utils/formatters';

export const columnasDespachoLista: ColumnaTabla[] = [
  {
    clave: 'id',
    nombre: 'Id',
    ancho: '80px',
  },
  {
    clave: 'servicio__nombre',
    nombre: 'Servicio',
  },
  {
    clave: 'fecha',
    nombre: 'Fecha',
    formato: valor => formatearFechaISO(valor),
  },
  {
    clave: 'operacion__nombre',
    nombre: 'Operación',
    ancho: '120px',
  },
  {
    clave: 'vehiculo__placa',
    nombre: 'Vehículo',
    ancho: '120px',
  },
  {
    clave: 'conductor__nombre_corto',
    nombre: 'Conductor',
    ancho: '150px',
  },
  {
    clave: 'ciudad_origen__nombre',
    nombre: 'Origen',
    ancho: '150px',
  },
  {
    clave: 'ciudad_destino__nombre',
    nombre: 'Destino',
    ancho: '150px',
  },
  {
    clave: 'pago',
    nombre: 'Pago',
    ancho: '100px',
    alineacion: 'derecha',
    formato: valor => formatearMonedaCOP(valor),
  },
  {
    clave: 'guias',
    nombre: 'Guías',
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
    clave: 'estado_aprobado',
    nombre: 'A',
    tooltip: 'Aprobado',
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
];
