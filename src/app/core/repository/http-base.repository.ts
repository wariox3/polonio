import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpBaseRepository {
  private httpClient = inject(HttpClient);
  private baseUrl: string;

  constructor() {
    // Usa directamente la URL base sin subdominio
    this.baseUrl = environment.apiBase; // http://reddocapi.online
  }

  /**
   * Determina si una URL es completa (comienza con http:// o https://)
   * @param url URL o endpoint a verificar
   * @returns boolean indicando si es una URL completa
   */
  private isFullUrl(url: string): boolean {
    return url.startsWith('http://') || url.startsWith('https://');
  }

  /**
   * Construye la URL completa si es necesario
   * @param endpoint Endpoint o URL completa
   * @returns URL completa para la petición
   */
  private buildUrl(endpoint: string): string {
    if (this.isFullUrl(endpoint)) {
      return endpoint; // Si ya es una URL completa, la devolvemos tal cual
    }
    // Normalizar la ruta para evitar dobles barras
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint.substring(1) : endpoint;
    return `${this.baseUrl}/${normalizedEndpoint}`;
  }

  // Método GET para listas
  public get<T>(endpoint: string, params?: HttpParams): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.httpClient.get<T>(url, { params });
  }

  // Método POST
  public post<T>(endpoint: string, data: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.httpClient.post<T>(url, data);
  }

  // Método PUT
  public put<T>(endpoint: string, data: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.httpClient.put<T>(url, data);
  }

  // Método DELETE
  public delete(endpoint: string, data?: any): Observable<any> {
    const url = this.buildUrl(endpoint);
    return this.httpClient.delete(url, data);
  }

  public patch<T>(endpoint: string, data: any): Observable<T> {
    const url = this.buildUrl(endpoint);
    return this.httpClient.patch<T>(url, data);
  }
}
