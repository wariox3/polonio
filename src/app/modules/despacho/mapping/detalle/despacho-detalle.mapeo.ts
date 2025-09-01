import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { formatearMonedaCOP } from '@app/common/utils/formatters';

/**
 * Función para crear los campos del detalle de despacho
 * @returns Array de campos configurados
 */
export function obtenerCamposDespachoDetalle(): CampoDetalle[] {
  return [
    { clave: 'servicio__nombre', etiqueta: 'Servicio' },
    { clave: 'despacho_tipo__nombre', etiqueta: 'Tipo' },
    {
      clave: 'pago',
      etiqueta: 'Pago',
      formato: valor => formatearMonedaCOP(valor),
      alineacion: 'derecha',
    },
    { clave: 'conductor__nombre_corto', etiqueta: 'Conductor' },
    { clave: 'vehiculo__placa', etiqueta: 'Vehículo' },
    {
      clave: 'flete',
      etiqueta: 'Flete',
      formato: valor => formatearMonedaCOP(valor),
      alineacion: 'derecha',
    },
    { clave: 'ruta__nombre', etiqueta: 'Ruta' },
    { clave: 'remolque__placa', etiqueta: 'Remolque' },
    { clave: '', etiqueta: '' },
    { clave: 'ciudad_origen__nombre', etiqueta: 'Ciudad origen' },
    { clave: 'ciudad_destino__nombre', etiqueta: 'Ciudad destino' },
    { clave: '', etiqueta: '' },
    { clave: 'operacion__nombre', etiqueta: 'Operación' },
    { clave: 'precinto', etiqueta: 'Precinto' },
    { clave: '', etiqueta: '' },
    {
      clave: 'comentario',
      etiqueta: 'Comentario',
      filaCompleta: true,
    },
  ];
}
