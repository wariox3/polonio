import { HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { QueryParams, RespuestaApi } from '../interfaces/api.interface';
import { SubdominioService } from '../services/subdominio.service';
import { HttpBaseRepository } from './http-base.repository';

@Injectable({
  providedIn: 'root',
})
export class GeneralRepository {
  private httpBase = inject(HttpBaseRepository);
  private subdominioService = inject(SubdominioService);

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
    return this.getWithSubdominio<T>(`${endpoint}/${id}`);
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
    return this.putWithSubdominio<T>(`${endpoint}/${id}`, data);
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
    return this.deleteWithSubdominio<T>(`${endpoint}/${id}`);
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
}
