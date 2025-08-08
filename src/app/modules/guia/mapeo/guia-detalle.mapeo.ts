import { CampoDetalle } from '@app/common/components/ui/tablas/tabla-detalles/tabla-detalles.component';
import { formatearMonedaCOP, formatearFechaISO } from '@app/common/utils/formatters';

/**
 * Función para crear los campos del detalle de guía
 * @param datos Objeto con los datos de la guía
 * @returns Array de campos configurados
 */
export function obtenerCamposGuiaDetalle(): CampoDetalle[] {
  return [
    { clave: 'fecha', etiqueta: 'Fecha' },
    { clave: 'documento', etiqueta: 'Documento' },
    { clave: 'remitente_nombre', etiqueta: 'Remitente' },
    { clave: 'destinatario__nombre_corto', etiqueta: 'Destinatario' },
    { clave: 'destinatario__direccion', etiqueta: 'Dirección' },
    { clave: 'destinatario__telefono', etiqueta: 'Teléfono' },
    { clave: 'destinatario__correo', etiqueta: 'Correo' },
    { clave: 'unidades', etiqueta: 'Unidades' },
    { clave: 'peso', etiqueta: 'Peso', formato: valor => `${valor} kg` },
    { clave: 'volumen', etiqueta: 'Volumen', formato: valor => `${valor} m³` },
    { clave: 'peso_facturado', etiqueta: 'Peso facturado', formato: valor => `${valor} kg` },
    {
      clave: 'declara',
      etiqueta: 'Valor declarado',
      formato: valor => formatearMonedaCOP(valor),
    },
    {
      clave: 'flete',
      etiqueta: 'Flete',
      formato: valor => formatearMonedaCOP(valor),
    },
    {
      clave: 'manejo',
      etiqueta: 'Manejo',
      formato: valor => formatearMonedaCOP(valor),
    },
    {
      clave: 'recaudo',
      etiqueta: 'Recaudo',
      formato: valor => formatearMonedaCOP(valor),
    },
    {
      clave: 'cobro_entrega',
      etiqueta: 'Cobro entrega',
      formato: valor => formatearMonedaCOP(valor),
    },
    { clave: 'ciudad_origen__nombre', etiqueta: 'Origen' },
    { clave: 'ciudad_destino__nombre', etiqueta: 'Destino' },
    { clave: 'servicio__nombre', etiqueta: 'Servicio' },
    { clave: 'producto__nombre', etiqueta: 'Producto' },
    { clave: 'empaque__nombre', etiqueta: 'Empaque' },
    { clave: 'ruta__nombre', etiqueta: 'Ruta' },
    { clave: 'zona__nombre', etiqueta: 'Zona' },
    { clave: 'liquidacion', etiqueta: 'Liquidación' },
    {
      clave: 'fecha_ingreso',
      etiqueta: 'Fecha ingreso',
      formato: valor => formatearFechaISO(valor),
    },
    {
      clave: 'fecha_entrega',
      etiqueta: 'Fecha entrega',
      formato: valor => formatearFechaISO(valor),
    },
    {
      clave: 'contenido_verificado',
      etiqueta: 'Contenido verificado',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'mercancia_peligrosa',
      etiqueta: 'Mercancía peligrosa',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'requiere_cita',
      etiqueta: 'Requiere cita',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_recogido',
      etiqueta: 'Estado recogido',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_ingreso',
      etiqueta: 'Estado ingreso',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_embarcado',
      etiqueta: 'Estado embarcado',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_despachado',
      etiqueta: 'Estado despachado',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_entregado',
      etiqueta: 'Estado entregado',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_soporte',
      etiqueta: 'Estado soporte',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_novedad',
      etiqueta: 'Estado novedad',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_novedad_solucionada',
      etiqueta: 'Novedad solucionada',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    {
      clave: 'estado_rndc',
      etiqueta: 'Estado RNDC',
      formato: valor => (valor ? 'SI' : 'NO'),
    },
    { clave: 'comentario', etiqueta: 'Comentario', filaCompleta: true },
  ];
}
