import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';

/**
 * Función para crear los campos del detalle de guía
 * @param datos Objeto con los datos de la guía
 * @returns Array de campos configurados
 */
export function obtenerCamposRutaDetalle(): CampoDetalle[] {
  return [{ clave: 'nombre', etiqueta: 'Nombre' }];
}
