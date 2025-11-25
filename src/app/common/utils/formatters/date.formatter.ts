/**
 * Formateador de fecha en formato ISO (YYYY-MM-DD)
 * @param valor Fecha a formatear (string, Date o timestamp)
 * @returns Cadena de string en formato YYYY-MM-DD
 */
export function formatearFechaISO(valor: any): string {
  if (!valor) return '';

  return valor.slice(0, 10);
}

/**
 * Formateador de fecha en formato ISO (YYYY-MM-DD)
 * @param valor Fecha a formatear (string, Date o timestamp)
 * @returns Cadena de string en formato YYYY-MM-DD
 */
export function formatearHora(valor: string): string {
  if (!valor) return '';

  return valor.slice(11, 16);
}

/**
 * Formateador de fecha con opciones personalizables
 * @param valor Fecha a formatear (string, Date o timestamp)
 * @param locale Configuración regional (por defecto 'es-CO')
 * @param opciones Opciones de formato de fecha
 * @returns Cadena de fecha formateada según las opciones
 */
export function formatearFecha(
  valor: string | Date | number,
  locale: string = 'es-CO',
  opciones: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }
): string {
  if (valor === null || valor === undefined) {
    return '';
  }
  return new Date(valor).toLocaleDateString(locale, opciones);
}
