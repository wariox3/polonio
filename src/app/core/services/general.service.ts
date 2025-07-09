import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { RespuestaApi } from 'src/app/core/interfaces/api.interface';

@Injectable({
  providedIn: 'root',
})
export class GeneralApiService {
  private _http = inject(HttpClient);

  constructor() {}

  consultaApi<T>(endpoint: string, queryParams: { [key: string]: any } = {}) {
    let params = new HttpParams();

    Object.keys(queryParams).forEach((key: any) => {
      if (queryParams[key] !== null && queryParams[key] !== undefined) {
        params = params.append(key, queryParams[key].toString());
      }
    });

    return this._http.get<RespuestaApi<T>>(endpoint, { params });
  }
}
