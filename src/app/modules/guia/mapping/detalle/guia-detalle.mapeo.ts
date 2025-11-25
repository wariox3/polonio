import { ConfiguracionBadge } from '@app/common/components/ui/badges/estado-badges-container/estado-badges-container.interface';
import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { formatearMonedaCOP, formatearFechaISO } from '@app/common/utils/formatters';

/**
 * Función para crear los campos del detalle de guía
 * @param datos Objeto con los datos de la guía
 * @returns Array de campos configurados
 */
export function obtenerCamposGuiaDetalle(): CampoDetalle[] {
  return [
    { clave: 'fecha', etiqueta: 'Fecha', formato: valor => formatearFechaISO(valor) },
    { clave: 'documento', etiqueta: 'Documento' },
    { clave: 'unidades', etiqueta: 'Unidades', alineacion: 'derecha' },
    { clave: 'cliente__nombre_corto', etiqueta: 'Cliente' },
    { clave: 'ciudad_origen__nombre', etiqueta: 'Origen' },
    { clave: 'peso', etiqueta: 'Peso', formato: valor => `${valor} kg`, alineacion: 'derecha' },
    { clave: 'contacto__nombre_corto', etiqueta: 'Contacto' },
    { clave: 'ciudad_destino__nombre', etiqueta: 'Destino' },
    {
      clave: 'volumen',
      etiqueta: 'Volumen (alto*largo*ancho*400)',
      formato: valor => `${valor} Kg`,
      alineacion: 'derecha',
    },
    { clave: 'remitente_nombre', etiqueta: 'Remitente' },
    { clave: 'operacion_ingreso__nombre', etiqueta: 'Operación ingreso' },
    {
      clave: 'peso_facturado',
      etiqueta: 'Peso facturado',
      formato: valor => `${valor} kg`,
      alineacion: 'derecha',
    },
    { clave: 'producto__nombre', etiqueta: 'Producto' },
    { clave: 'operacion_cargo__nombre', etiqueta: 'Operación cargo' },
    {
      clave: 'recaudo',
      etiqueta: 'Recaudo',
      formato: valor => formatearMonedaCOP(valor),
      alineacion: 'derecha',
    },
    { clave: 'empaque__nombre', etiqueta: 'Empaque' },

    { clave: 'servicio__nombre', etiqueta: 'Servicio' },
    {
      clave: 'cobro_entrega',
      etiqueta: 'Cobro entrega',
      formato: valor => formatearMonedaCOP(valor),
      alineacion: 'derecha',
    },
    { clave: 'ruta__nombre', etiqueta: 'Ruta' },
    {
      clave: 'fecha_ingreso',
      etiqueta: 'Fecha ingreso',
      formato: valor => formatearFechaISO(valor),
    },
    {
      clave: '',
      etiqueta: '',
    },
    { clave: 'zona__nombre', etiqueta: 'Zona' },

    {
      clave: 'fecha_entrega',
      etiqueta: 'Fecha entrega',
      formato: valor => formatearFechaISO(valor),
    },
    {
      clave: '',
      etiqueta: '',
    },
    {
      clave: 'contenido_verificado',
      etiqueta: 'Contenido verificado',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: '',
      etiqueta: '',
    },
    {
      clave: '',
      etiqueta: ' ',
    },

    {
      clave: 'mercancia_peligrosa',
      etiqueta: 'Mercancía peligrosa',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: '',
      etiqueta: '',
    },
    {
      clave: '',
      etiqueta: '',
    },
    {
      clave: 'requiere_cita',
      etiqueta: 'Requiere cita',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: '',
      etiqueta: '',
    },
    {
      clave: '',
      etiqueta: '',
    },
    { clave: 'comentario', etiqueta: 'Comentario', filaCompleta: true },
  ];
}

export function obtenerCamposGuiaDetalleDestinatario(): CampoDetalle[] {
  return [
    { clave: 'destinatario_nombre', etiqueta: 'Destinatario' },
    { clave: 'destinatario_direccion', etiqueta: 'Dirección' },
    { clave: 'destinatario_telefono', etiqueta: 'Teléfono' },
    { clave: 'destinatario_correo', etiqueta: 'Correo' },
  ];
}

/**
 * Configuración de los estados para la guía
 */
export const configuracionEstados: ConfiguracionBadge[] = [
  { clave: 'estado_recogido', etiqueta: 'Recogido' },
  { clave: 'estado_ingreso', etiqueta: 'Ingreso' },
  { clave: 'estado_despachado', etiqueta: 'Despachado' },
  { clave: 'estado_rndc', etiqueta: 'RNDC' },
  { clave: 'estado_entregado', etiqueta: 'Entregado' },
  { clave: 'estado_soporte', etiqueta: 'Soporte' },
  { clave: 'estado_novedad', etiqueta: 'Novedad' },
  { clave: 'estado_novedad_solucionada', etiqueta: 'Novedad Solucionada' },
];
