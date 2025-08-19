import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class FechaService {
  /**
   * Obtiene la fecha actual en formato ISO (YYYY-MM-DD)
   * @returns Fecha actual en formato YYYY-MM-DD
   */
  obtenerFechaHoy(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Obtiene la fecha actual como objeto Date
   * @returns Objeto Date con la fecha actual
   */
  obtenerFechaActual(): Date {
    return new Date();
  }

  /**
   * Convierte una fecha a formato ISO (YYYY-MM-DD)
   * @param fecha Fecha a convertir (Date, string o timestamp)
   * @returns Fecha en formato YYYY-MM-DD
   */
  convertirAFormatoISO(fecha: Date | string | number): string {
    if (fecha === null || fecha === undefined) {
      return '';
    }
    return new Date(fecha).toISOString().split('T')[0];
  }

  /**
   * Obtiene una fecha con días agregados o sustraídos
   * @param dias Número de días a agregar (positivo) o sustraer (negativo)
   * @param fechaBase Fecha base (por defecto la fecha actual)
   * @returns Fecha calculada en formato YYYY-MM-DD
   */
  obtenerFechaConDias(dias: number, fechaBase?: Date): string {
    const fecha = fechaBase ? new Date(fechaBase) : new Date();
    fecha.setDate(fecha.getDate() + dias);
    return this.convertirAFormatoISO(fecha);
  }

  /**
   * Valida si una fecha es válida
   * @param fecha Fecha a validar
   * @returns true si la fecha es válida, false en caso contrario
   */
  esFechaValida(fecha: string | Date | number): boolean {
    const fechaObj = new Date(fecha);
    return !isNaN(fechaObj.getTime());
  }

  /**
   * Compara dos fechas
   * @param fecha1 Primera fecha
   * @param fecha2 Segunda fecha
   * @returns -1 si fecha1 < fecha2, 0 si son iguales, 1 si fecha1 > fecha2
   */
  compararFechas(fecha1: Date | string, fecha2: Date | string): number {
    const f1 = new Date(fecha1);
    const f2 = new Date(fecha2);

    if (f1 < f2) return -1;
    if (f1 > f2) return 1;
    return 0;
  }

  obtenerAnioActual(): number {
    return new Date().getFullYear();
  }
}
