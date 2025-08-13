import { HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { AlertaService } from '@app/common/services/alerta.service';
import { Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { QueryParams } from '../interfaces/api.interface';
import { SubdominioService } from '../services/subdominio.service';
import { HttpBaseRepository } from './http-base.repository';

@Injectable({
  providedIn: 'root',
})
export class GeneralRepository {
  private httpBase = inject(HttpBaseRepository);
  private subdominioService = inject(SubdominioService);
  private alertaService = inject(AlertaService);

  /**
   * Realiza una consulta GET a la API con el subdominio actual
   * @param endpoint Ruta del endpoint a consultar
   * @param queryParams Parámetros de consulta opcionales
   * @returns Observable con la respuesta tipada
   */
  get<T>(endpoint: string, queryParams: QueryParams = {}): Observable<T> {
    const params = this.buildHttpParams(queryParams);
    return this.getWithSubdominio<T>(endpoint, params);
  }

  /**
   * Realiza una consulta GET para obtener un único recurso con el subdominio actual
   * @param endpoint Ruta del endpoint a consultar
   * @param id Identificador del recurso
   * @returns Observable con la respuesta tipada
   */
  getById<T>(endpoint: string, id: string | number): Observable<T> {
    return this.getWithSubdominio<T>(`${endpoint}${id}/`);
  }

  /**
   * Crea un nuevo recurso mediante POST con el subdominio actual
   * @param endpoint Ruta del endpoint
   * @param data Datos a enviar
   * @returns Observable con la respuesta tipada
   */
  create<T>(endpoint: string, data: any): Observable<T> {
    return this.postWithSubdominio<T>(endpoint, data);
  }

  /**
   * Actualiza un recurso existente mediante PUT con el subdominio actual
   * @param endpoint Ruta del endpoint
   * @param id Identificador del recurso
   * @param data Datos a actualizar
   * @returns Observable con la respuesta tipada
   */
  update<T>(endpoint: string, id: string | number, data: any): Observable<T> {
    return this.putWithSubdominio<T>(`${endpoint}${id}/`, data);
  }

  /**
   * Actualiza parcialmente un recurso mediante PATCH con el subdominio actual
   * @param endpoint Ruta del endpoint
   * @param id Identificador del recurso
   * @param data Datos a actualizar
   * @returns Observable con la respuesta tipada
   */
  patch<T>(endpoint: string, id: string | number, data: any): Observable<T> {
    return this.patchWithSubdominio<T>(`${endpoint}/${id}`, data);
  }

  /**
   * Elimina un recurso mediante DELETE con el subdominio actual
   * @param endpoint Ruta del endpoint
   * @param id Identificador del recurso
   * @returns Observable con la respuesta
   */
  delete<T>(endpoint: string, id: string | number): Observable<T> {
    return this.deleteWithSubdominio<T>(`${endpoint}${id}/`);
  }

  public descargarArchivos(endpoint: string, queryParams: QueryParams = {}): void {
    const params = this.buildHttpParams(queryParams);
    this.alertaService.mensajaEspera('espera');
    this.subdominioService
      .getSubdominioUrl()
      .pipe(
        switchMap(subdominioUrl => {
          const url = `${subdominioUrl}/${endpoint}`;
          return this.httpBase.getArchivo(url, params);
        }),
        catchError(() => {
          this.alertaService.cerrar();
          this.alertaService.mostrarError(`Error 15`, 'El documento no tiene un formato');
          return of(null);
        })
      )
      .subscribe(response => {
        if (!response) return;

        const nombreArchivo = this.obtenerNombreArchivo(response.headers);
        this.descargarBlob(response.body, nombreArchivo);
        setTimeout(() => this.alertaService.cerrar(), 1000);
      });
  }

  /**
   * Consultar un recurso mediante POST con el subdominio actual
   * @param endpoint Ruta del endpoint
   * @param data Datos a enviar
   * @returns Observable con la respuesta tipada
   */
  public post<T>(endpoint: string, data: any): Observable<T> {
    return this.postWithSubdominio<T>(endpoint, data);
  }

  /**
   * Construye los parámetros HTTP a partir de los parámetros de consulta
   * @param queryParams Parámetros de consulta
   * @returns HttpParams
   */
  private buildHttpParams(queryParams: QueryParams): HttpParams {
    let params = new HttpParams();

    Object.keys(queryParams).forEach(key => {
      if (queryParams[key] !== null && queryParams[key] !== undefined) {
        params = params.append(key, queryParams[key].toString());
      }
    });

    return params;
  }

  // Métodos privados que utilizan el subdominio

  private getWithSubdominio<T>(endpoint: string, params?: HttpParams): Observable<T> {
    return this.subdominioService.getSubdominioUrl().pipe(
      switchMap(subdominioUrl => {
        const url = `${subdominioUrl}/${endpoint}`;
        return this.httpBase.get<T>(url, params);
      })
    );
  }

  private postWithSubdominio<T>(endpoint: string, data: any): Observable<T> {
    return this.subdominioService.getSubdominioUrl().pipe(
      switchMap(subdominioUrl => {
        const url = `${subdominioUrl}/${endpoint}`;

        return this.httpBase.post<T>(url, data);
      })
    );
  }

  private putWithSubdominio<T>(endpoint: string, data: any): Observable<T> {
    return this.subdominioService.getSubdominioUrl().pipe(
      switchMap(subdominioUrl => {
        const url = `${subdominioUrl}/${endpoint}`;
        return this.httpBase.put<T>(url, data);
      })
    );
  }

  private patchWithSubdominio<T>(endpoint: string, data: any): Observable<T> {
    return this.subdominioService.getSubdominioUrl().pipe(
      switchMap(subdominioUrl => {
        const url = `${subdominioUrl}/${endpoint}`;
        return this.httpBase.patch<T>(url, data);
      })
    );
  }

  private deleteWithSubdominio<T>(endpoint: string): Observable<T> {
    return this.subdominioService.getSubdominioUrl().pipe(
      switchMap(subdominioUrl => {
        const url = `${subdominioUrl}/${endpoint}`;
        return this.httpBase.delete(url, {});
      })
    );
  }

  private obtenerNombreArchivo(headers: HttpHeaders): string {
    const contentDisposition = headers.get('Content-Disposition');
    if (!contentDisposition) {
      throw new Error('Error no existe Content-Disposition');
    }

    let nombreArchivo = contentDisposition.split(';')[1].trim().split('=')[1];
    nombreArchivo = decodeURI(nombreArchivo.replace(/"/g, ''));
    if (!nombreArchivo) {
      throw new Error('fileName error');
    }
    return nombreArchivo;
  }

  private descargarBlob(data: Blob | null, nombreArchivo: string): void {
    if (!data) return;

    const blob = new Blob([data], { type: data.type });
    const objectUrl = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = objectUrl;
    a.download = nombreArchivo;
    a.click();

    URL.revokeObjectURL(objectUrl);
  }
}
