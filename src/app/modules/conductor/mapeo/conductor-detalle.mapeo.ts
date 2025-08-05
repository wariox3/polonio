import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { Conductor } from '../interfaces/conductor.interface';

/**
 * Función para crear los campos del detalle de conductor
 * @param datos Objeto con los datos del conductor
 * @returns Array de campos configurados
 */
export function obtenerCamposConductorDetalle(datos: Conductor): CampoDetalle[] {
  return [
    { clave: 'nombre_corto', etiqueta: 'Nombre' },
    { clave: 'identificacion__nombre', etiqueta: 'Tipo identificación' },
    {
      clave: 'numero_identificacion',
      etiqueta: 'Identificación',
      formato: valor => `${valor} - ${datos.digito_verificacion}`,
    },
    { clave: 'direccion', etiqueta: 'Dirección' },
    { clave: 'telefono', etiqueta: 'Teléfono' },
    { clave: 'celular', etiqueta: 'Celular' },
    { clave: 'fecha_ingreso', etiqueta: 'Fecha ingreso' },
    { clave: 'fecha_retiro', etiqueta: 'Fecha retiro' },
    { clave: 'numero_licencia', etiqueta: 'Licencia' },
    { clave: 'fecha_expedicion_licencia', etiqueta: 'Fecha expedición licencia' },
    { clave: 'fecha_expedicion_licencia', etiqueta: 'Fecha vencimiento licencia' },
    { clave: 'comentario', etiqueta: 'Comentario', filaCompleta: true },
  ];
}
