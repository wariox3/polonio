import { inject, Injectable } from '@angular/core';
import { CookieService } from '@app/core/services/cookie.service';
import { ContenedorLista } from '../interfaces/contenedor.interface';

@Injectable({
  providedIn: 'root',
})
export class ContenedorService {
  private _cookieService = inject(CookieService);

  constructor() {}

  /**
   * Verifica si un contenedor está restringido
   * @param valorSaldo Valor del saldo del usuario
   * @param fechaLimitePago Fecha límite de pago
   * @returns true si el contenedor está restringido, false en caso contrario
   */
  isContenedorRestringido(valorSaldo: number, fechaLimitePago: string) {
    // Si no hay fecha límite, no hay restricción
    if (!fechaLimitePago) {
      return false;
    }

    const fechaHoy = new Date();
    const fechaLimite = new Date(fechaLimitePago);

    // Normalizar las fechas para comparar solo año, mes y día
    const hoy = new Date(fechaHoy.getFullYear(), fechaHoy.getMonth(), fechaHoy.getDate());
    const limite = new Date(
      fechaLimite.getFullYear(),
      fechaLimite.getMonth(),
      fechaLimite.getDate()
    );

    // Si el saldo es mayor a 0 y la fecha límite ya pasó
    if (valorSaldo > 0 && hoy > limite) {
      return true; // Contenedor restringido
    }

    return false; // Contenedor no restringido
  }

  /**
   * Agrega propiedades adicionales a los contenedores
   * @param contenedores Lista de contenedores
   * @returns Lista de contenedores con propiedades adicionales
   */
  agregarPropiedades(contenedores: ContenedorLista[]) {
    // Obtener el usuario de la cookie para verificar saldo y fecha límite
    const usuarioCookie = this._cookieService?.get('usuario');
    let valorSaldo = 0;
    let fechaLimitePago = '';

    if (usuarioCookie) {
      try {
        const usuario = JSON.parse(usuarioCookie);
        valorSaldo = usuario.vr_saldo || 0;
        fechaLimitePago = usuario.fecha_limite_pago || '';
      } catch (error) {
        console.error('Error al parsear la cookie de usuario:', error);
      }
    }

    return contenedores.map(contenedor => {
      return {
        ...contenedor,
        acceso_restringido: this.isContenedorRestringido(valorSaldo, fechaLimitePago),
      };
    });
  }
}
