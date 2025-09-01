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
      clave: 'unidades',
      etiqueta: 'Unidades',
      alineacion: 'derecha',
    },
    { clave: 'conductor__nombre_corto', etiqueta: 'Conductor' },
    { clave: 'vehiculo__placa', etiqueta: 'Vehículo' },
    { clave: 'peso', etiqueta: 'Peso', formato: valor => `${valor} kg`, alineacion: 'derecha' },
    {
      clave: 'contacto__nombre_corto',
      etiqueta: 'Contacto',
    },
    { clave: 'remolque__placa', etiqueta: 'Remolque' },
    {
      clave: 'volumen',
      etiqueta: 'Volumen',
      formato: valor => `${valor} Kg`,
      alineacion: 'derecha',
    },
    { clave: 'ciudad_origen__nombre', etiqueta: 'Ciudad origen' },
    { clave: 'operacion__nombre', etiqueta: 'Operación' },
    {
      clave: 'pago',
      etiqueta: 'Pago',
      formato: valor => formatearMonedaCOP(valor),
      alineacion: 'derecha',
    },
    { clave: 'ciudad_destino__nombre', etiqueta: 'Ciudad destino' },

    { clave: 'precinto', etiqueta: 'Precinto' },
    { clave: '', etiqueta: '' },
        { clave: 'ruta__nombre', etiqueta: 'Ruta' },

    { clave: '', etiqueta: '' },
    { clave: '', etiqueta: '' },
    {
      clave: 'comentario',
      etiqueta: 'Comentario',
      filaCompleta: true,
    },
  ];
}
