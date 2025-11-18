import { inject, Injectable, signal } from '@angular/core';
import { RespuestaApi, QueryParams } from '@app/core/interfaces/api.interface';
import { Verificacion } from '../interfaces/verificacion.interface';
import { HttpBaseRepository } from '@app/core/repository/http-base.repository';
import { FilterTransformerService } from '@app/common/components/ui/filtro/service/filter-transformer.service';
@Injectable({
  providedIn: 'root',
})
export class VerificacionRepository {
  private _httpBaseRepository = inject(HttpBaseRepository);
  private _filterTransformService = inject(FilterTransformerService);

  public totalItems = signal<number>(0);

  lista(queryParams: QueryParams) {
    const params = this._filterTransformService.toQueryString({
      ...queryParams,
    });

    return this._httpBaseRepository.get<RespuestaApi<Verificacion>>(
      '/vertical/verificacion/?' + params
    );
  }

  verificar(verificacionId: number) {
    return this._httpBaseRepository.post<any>(`/vertical/verificacion/verificar/`, {
      id: verificacionId,
    });
  }

  proceso(verificacionId: number) {
    return this._httpBaseRepository.post<any>(`/vertical/verificacion/proceso/`, {
      id: verificacionId,
    });
  }

  getDetalle(verificacionId: number) {
    return this._httpBaseRepository.get<any>(`/vertical/verificacion/${verificacionId}/`);
  }

  detallesPorVerificacion(verificacionId: number) {
    return this._httpBaseRepository.get<any>(
      `/vertical/verificacion_detalle/?verificacion_id=${verificacionId}`
    );
  }

  verificarDetalle(verificacionDetalleId: number) {
    return this._httpBaseRepository.post<any>(`/vertical/verificacion_detalle/verificar/`, {
      id: verificacionDetalleId,
    });
  }
}
