import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

/**
 * Interfaz que define los tipos de alertas disponibles
 */
export interface IAlertOptions {
  title?: string;
  message: string;
  icon?: 'success' | 'error' | 'warning' | 'info' | 'question';
  timer?: number;
  position?:
  | 'top'
  | 'top-start'
  | 'top-end'
  | 'center'
  | 'center-start'
  | 'center-end'
  | 'bottom'
  | 'bottom-start'
  | 'bottom-end';
  showConfirmButton?: boolean;
  showCancelButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  confirmButtonColor?: string;
  customClass?: Record<string, string>;
  input?: string;
  inputLabel?: string;
  html?: boolean;
  toast?: boolean;
  timerProgressBar?: boolean;
  allowOutsideClick?: boolean;
}

/**
 * Interfaz para el proveedor de alertas
 */
export interface IAlertProvider {
  showSuccess(options: IAlertOptions): Promise<any>;
  showError(options: IAlertOptions): Promise<any>;
  showWarning(options: IAlertOptions): Promise<any>;
  showInfo(options: IAlertOptions): Promise<any>;
  showConfirmation(options: IAlertOptions): Promise<any>;
  showLoading(options: IAlertOptions): Promise<any>;
  close(): void;
  isVisible(): boolean;
}

/**
 * Implementación de SweetAlert2 como proveedor de alertas
 */
@Injectable()
export class SweetAlert2Provider implements IAlertProvider {
  private getBaseConfig() {
    return {
      customClass: {
        container: '!font-sans !overflow-hidden',
        popup: '!rounded-lg !shadow-xl !py-2 !px-4',
        title: '!text-lg !font-bold !text-gray-800 !overflow-hidden',
        closeButton: '!text-gray-400 hover:!text-gray-600',
        icon: '!mx-auto !mb-4',
        content: '!text-gray-600',
        input:
          '!mt-2 !border !border-gray-300 !rounded !px-3 !py-2 focus:!outline-none focus:!ring-2 focus:!ring-blue-500',
        actions: '!mt-6 !flex !justify-end !space-x-3',
        confirmButton: '!px-4 !py-2 !rounded !font-medium !shadow-sm',
        cancelButton:
          '!px-4 !py-2 !rounded !font-medium !bg-white !border !border-gray-300 !text-gray-700 !shadow-sm hover:!bg-gray-50',
        footer: '!mt-4 !text-gray-500 !text-sm',
      },
      buttonsStyling: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    };
  }

  async showSuccess(options: IAlertOptions): Promise<any> {
    return Swal.fire({
      ...this.getBaseConfig(),
      title: options.title || 'Éxito',
      html: options.html ? options.message : undefined,
      text: !options.html ? options.message : undefined,
      icon: 'success',
      position: options.position || 'bottom-right',
      toast: options.toast !== undefined ? options.toast : true,
      timer: options.timer || 5000,
      timerProgressBar: options.timerProgressBar !== undefined ? options.timerProgressBar : true,
      showConfirmButton:
        options.showConfirmButton !== undefined ? options.showConfirmButton : false,
      confirmButtonText: options.confirmButtonText,
      confirmButtonColor: options.confirmButtonColor || '#009EF7',
      allowOutsideClick: options.allowOutsideClick,
    });
  }

  async showError(options: IAlertOptions): Promise<any> {
    return Swal.fire({
      ...this.getBaseConfig(),
      title: options.title || 'Error',
      html: options.html ? options.message : undefined,
      text: !options.html ? options.message : undefined,
      icon: 'error',
      position: options.position || 'bottom-right',
      toast: options.toast !== undefined ? options.toast : true,
      timer: options.timer || 20000,
      timerProgressBar: options.timerProgressBar !== undefined ? options.timerProgressBar : true,
      showConfirmButton: options.showConfirmButton !== undefined ? options.showConfirmButton : true,
      confirmButtonText: options.confirmButtonText || 'Cerrar',
      confirmButtonColor: options.confirmButtonColor || '#d9214e',
    });
  }

  async showWarning(options: IAlertOptions): Promise<any> {
    return Swal.fire({
      ...this.getBaseConfig(),
      title: options.title || 'Advertencia',
      html: options.html ? options.message : undefined,
      text: !options.html ? options.message : undefined,
      icon: 'warning',
      showCancelButton: options.showCancelButton !== undefined ? options.showCancelButton : true,
      confirmButtonColor: options.confirmButtonColor || '#f1416c',
      confirmButtonText: options.confirmButtonText || 'Aceptar',
      cancelButtonText: options.cancelButtonText || 'Cancelar',
    });
  }

  async showInfo(options: IAlertOptions): Promise<any> {
    return Swal.fire({
      ...this.getBaseConfig(),
      title: options.title,
      html: options.html ? options.message : undefined,
      text: !options.html ? options.message : undefined,
      icon: 'info',
      showConfirmButton: options.showConfirmButton !== undefined ? options.showConfirmButton : true,
      confirmButtonText: options.confirmButtonText || 'Aceptar',
      confirmButtonColor: options.confirmButtonColor || '#009EF7',
    });
  }

  async showConfirmation(options: IAlertOptions): Promise<any> {
    return Swal.fire({
      ...this.getBaseConfig(),
      title: options.title || 'Confirmar',
      html: options.html ? options.message : undefined,
      text: !options.html ? options.message : undefined,
      icon: options.icon || 'warning',
      showCancelButton: true,
      confirmButtonColor: options.confirmButtonColor || '#d33',
      confirmButtonText: options.confirmButtonText || 'Confirmar',
      cancelButtonText: options.cancelButtonText || 'Cancelar',
    });
  }

  async showLoading(options: IAlertOptions): Promise<any> {
    const result = Swal.fire({
      ...this.getBaseConfig(),
      title: options.title,
      html: options.message,
      icon: options.icon || 'info',
      timerProgressBar: options.timerProgressBar !== undefined ? options.timerProgressBar : true,
      showConfirmButton:
        options.showConfirmButton !== undefined ? options.showConfirmButton : false,
      allowOutsideClick:
        options.allowOutsideClick !== undefined ? options.allowOutsideClick : false,
    });

    Swal.showLoading();
    return result;
  }

  close(): void {
    Swal.close();
  }

  isVisible(): boolean {
    return Swal.isVisible();
  }
}

/**
 * Servicio de alertas principal que utiliza el patrón de estrategia
 * para permitir diferentes implementaciones de alertas
 */
@Injectable({
  providedIn: 'root',
})
export class AlertaService {
  private provider: IAlertProvider;

  constructor() {
    // Por defecto usamos SweetAlert2, pero podríamos cambiar a otra implementación
    this.provider = new SweetAlert2Provider();
  }

  /**
   * Permite cambiar el proveedor de alertas en tiempo de ejecución
   */
  setProvider(provider: IAlertProvider): void {
    this.provider = provider;
  }

  /**
   * Muestra un mensaje de éxito
   */
  async mostrarExito(
    mensaje: string,
    titulo?: string,
    opciones: Partial<IAlertOptions> = {}
  ): Promise<any> {
    return this.provider.showSuccess({
      message: mensaje,
      title: titulo || 'Operación exitosa',
      ...opciones,
    });
  }

  /**
   * Muestra un mensaje de error
   */
  async mostrarError(
    mensaje: string,
    titulo?: string,
    opciones: Partial<IAlertOptions> = {}
  ): Promise<any> {
    return this.provider.showError({
      message: mensaje,
      title: titulo || 'Error',
      ...opciones,
    });
  }

  /**
   * Muestra un mensaje de advertencia
   */
  async mostrarAdvertencia(
    mensaje: string,
    titulo?: string,
    opciones: Partial<IAlertOptions> = {}
  ): Promise<any> {
    return this.provider.showWarning({
      message: mensaje,
      title: titulo || 'Advertencia',
      ...opciones,
    });
  }

  /**
   * Muestra un mensaje informativo
   */
  async mostrarInfo(
    mensaje: string,
    titulo?: string,
    opciones: Partial<IAlertOptions> = {}
  ): Promise<any> {
    return this.provider.showInfo({
      message: mensaje,
      title: titulo,
      ...opciones,
    });
  }

  /**
   * Muestra un diálogo de confirmación
   */
  async confirmar(
    mensaje: string,
    titulo?: string,
    opciones: Partial<IAlertOptions> = {}
  ): Promise<any> {
    return this.provider.showConfirmation({
      message: mensaje,
      title: titulo || 'Confirmar acción',
      ...opciones,
    });
  }

  /**
   * Muestra un indicador de carga
   */
  async mostrarCarga(mensaje: string, opciones: Partial<IAlertOptions> = {}): Promise<any> {
    return this.provider.showLoading({
      message: mensaje,
      ...opciones,
    });
  }

  /**
   * Cierra cualquier alerta activa
   */
  cerrar(): void {
    this.provider.close();
  }

  /**
   * Verifica si hay alguna alerta visible
   */
  estaVisible(): boolean {
    return this.provider.isVisible();
  }

  /**
   * Método para redirigir después de mostrar un mensaje
   * Mantenemos este método para compatibilidad con el código existente
   */
  async mostrarYRedirigir(
    mensaje: string,
    ruta: string = '/',
    opciones: Partial<IAlertOptions> = {}
  ): Promise<any> {
    return this.provider
      .showSuccess({
        message: mensaje,
        timer: 5000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
        ...opciones,
      })
      .then(() => {
        window.location.href = ruta;
      });
  }

  async mensajaEspera(
    text: string,
    icon: 'success' | 'error' | 'warning' | 'info' | 'question' = 'info',
  ) {
    return await (Swal.fire({
      html: text,
      icon,
      timerProgressBar: true,
      showConfirmButton: true,
      allowOutsideClick: false,
      showClass: {
        popup: 'animate__animated animate__fadeInDown',
      },
      hideClass: {
        popup: 'animate__animated animate__fadeOutUp',
      },
    }),
    Swal.showLoading());
  }
}
