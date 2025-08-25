import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { formatearMonedaCOP } from '@app/common/utils/formatters';

/**
 * Función para crear los campos del detalle de despacho
 * @returns Array de campos configurados
 */
export function obtenerCamposDespachoDetalle(): CampoDetalle[] {
  return [
    { clave: 'despacho_tipo__nombre', etiqueta: 'Tipo', filaCompleta: true },
    { clave: 'vehiculo__placa', etiqueta: 'Vehículo' },
    { clave: 'remolque__placa', etiqueta: 'Remolque' },
    { clave: 'conductor__nombre_corto', etiqueta: 'Conductor' },
    { clave: 'ciudad_origen__nombre', etiqueta: 'Ciudad origen' },
    { clave: 'ciudad_destino__nombre', etiqueta: 'Ciudad destino' },
    { clave: 'ruta__nombre', etiqueta: 'Ruta' },
    { clave: 'operacion__nombre', etiqueta: 'Operación' },
    {
      clave: 'pago',
      etiqueta: 'Pago',
      formato: valor => formatearMonedaCOP(valor),
    },
    {
      clave: 'flete',
      etiqueta: 'Flete',
      formato: valor => formatearMonedaCOP(valor),
    },
    {
      clave: 'comentario',
      etiqueta: 'Comentario',
      filaCompleta: true,
    },
  ];
}
