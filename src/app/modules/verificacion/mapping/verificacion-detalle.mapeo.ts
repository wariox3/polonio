import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { formatearFechaISO } from '@app/common/utils/formatters';

/**
 * Función para crear los campos del detalle de vehículo
 * @param datos Objeto con los datos del vehículo
 * @returns Array de campos configurados
 */
export function obtenerCamposVerificacionDetalle(): CampoDetalle[] {
  return [
    { clave: 'id', etiqueta: 'Id' },
    {
      clave: 'fecha_registro',
      etiqueta: 'Fecha registro',
      formato: valor => formatearFechaISO(valor),
    },
    { clave: 'vehiculo__placa', etiqueta: 'Placa', filaCompleta: true },
    { clave: 'conductor__numero_identificacion', etiqueta: 'Identificación' },
    { clave: 'conductor__nombre_corto', etiqueta: 'Conductor' },
    {
      clave: 'estado_proceso',
      etiqueta: 'Proceso',
      formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'verificado',
      etiqueta: 'Verificado',
      formato: (valor: boolean) => (valor ? 'SI' : 'NO'),
    },
  ];
}
