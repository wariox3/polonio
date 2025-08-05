import { inject, Injectable } from '@angular/core';
import { obtenerContenedorSubdominio } from '@app/modules/contenedor/store/selectors/contenedor.selectors';
import { environment } from '@environments/environment';
import { Store } from '@ngrx/store';
import { map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SubdominioService {
  private API_SUBDOMAIN = environment.apiSubdomain;
  private store = inject(Store);
  private subdominio = '';

  constructor() {
    this.store.select(obtenerContenedorSubdominio).subscribe(subdominio => {
      this.subdominio = subdominio;
    });
  }

  /**
   * Obtiene la URL del subdominio actual de forma reactiva
   * @returns Observable con la URL completa del subdominio
   */
  getSubdominioUrl(): Observable<string> {
    return of(`${this.API_SUBDOMAIN.replace('subdomain', this.subdominio || '')}`);
  }

  /**
   * Construye una URL completa para una ruta específica usando el subdominio actual
   * @param path Ruta relativa para añadir a la URL base del subdominio
   * @returns Observable con la URL completa
   */
  buildUrl(path: string): Observable<string> {
    return this.getSubdominioUrl().pipe(
      map(baseUrl => {
        // Asegurarse de que la URL base termina con / y la ruta no comienza con /
        const normalizedBaseUrl = baseUrl.endsWith('/') ? baseUrl : `${baseUrl}/`;
        const normalizedPath = path.startsWith('/') ? path.substring(1) : path;
        return `${normalizedBaseUrl}${normalizedPath}`;
      })
    );
  }
}
