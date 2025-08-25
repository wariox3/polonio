import { ColumnaTabla } from '@app/common/interfaces/columnas.interface';

export const columnasDespachoLista: ColumnaTabla[] = [
  {
    clave: 'id',
    nombre: 'ID',
    ancho: '80px',
  },
  {
    clave: 'vehiculo__placa',
    nombre: 'Vehículo',
    ancho: '120px',
  },
  {
    clave: 'remolque__placa',
    nombre: 'Remolque',
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
    clave: 'ruta__nombre',
    nombre: 'Ruta',
    ancho: '120px',
  },
  {
    clave: 'operacion__nombre',
    nombre: 'Operación',
    ancho: '120px',
  },
  {
    clave: 'pago',
    nombre: 'Pago',
    ancho: '100px',
  },
  {
    clave: 'flete',
    nombre: 'Flete',
    ancho: '100px',
  },
];
