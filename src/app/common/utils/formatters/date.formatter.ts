/**
 * Formateador de fecha en formato ISO (YYYY-MM-DD)
 * @param valor Fecha a formatear (string, Date o timestamp)
 * @returns Cadena de fecha en formato YYYY-MM-DD
 */
export function formatearFechaISO(valor: any): string {
  if (!valor) return '';

  const fecha = new Date(valor);

  // Verificar si la fecha es válida
  if (isNaN(fecha.getTime())) {
    return ''; // o podrías devolver "Fecha inválida"
  }

  return fecha.toISOString().slice(0, 19).replace('T', ' ');
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
