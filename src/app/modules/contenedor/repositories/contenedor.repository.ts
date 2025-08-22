import { inject, Injectable, signal } from '@angular/core';
import { FilterTransformerService } from '@app/common/components/ui/filtro/service/filter-transformer.service';
import { QueryParams, RespuestaApi } from '@app/core/interfaces/api.interface';
import { HttpBaseRepository } from '@app/core/repository/http-base.repository';
import { RespuestaInvitacionUsuario } from '@app/modules/auth/interfaces/usuario.interface';
import { map } from 'rxjs/operators';
import {
  ConectarResponse,
  ConsultaContenedorResponse,
  ContenedorLista,
  InvitarUsuario,
} from '../interfaces/contenedor.interface';
import { ContenedorService } from '../services/contenedor.service';

@Injectable({
  providedIn: 'root',
})
export class ContenedorRepository {
  private _httpBaseRepository = inject(HttpBaseRepository);
  private _filterTransformService = inject(FilterTransformerService);
  private _contenedorService = inject(ContenedorService);

  public totalItems = signal<number>(0);

  getMisContenedores(queryParams: QueryParams) {
    const params = this._filterTransformService.toQueryString({
      ...queryParams,
      serializador: 'lista',
      contenedor__reddoc: 'True',
    });

    return this._httpBaseRepository
      .get<RespuestaApi<ContenedorLista>>('/contenedor/usuariocontenedor/?' + params)
      .pipe(
        map(respuesta => {
          this.totalItems.set(respuesta.count);

          return {
            ...respuesta,
            results: this._contenedorService.agregarPropiedades(respuesta.results),
          };
        })
      );
  }

  listaUsuarios(contenedorId: number) {
    return this._httpBaseRepository.post<ConsultaContenedorResponse>(
      `/contenedor/usuariocontenedor/consulta-contenedor/`,
      {
        contenedor_id: contenedorId,
      }
    );
  }

  getDetalle(contenedorId: number) {
    return this._httpBaseRepository.get<ConectarResponse>(
      `/contenedor/contenedor/${contenedorId}/`
    );
  }

  eliminar(contenedorId: number) {
    return this._httpBaseRepository.delete(`/contenedor/contenedor/${contenedorId}/`);
  }

  invitarUsuario(payload: InvitarUsuario) {
    return this._httpBaseRepository.post<RespuestaInvitacionUsuario>(
      `/contenedor/usuariocontenedor/invitar/`,
      {
        accion: payload.accion,
        contenedor_id: payload.contenedor_id,
        usuario_id: payload.usuario_id,
        invitado: payload.invitado,
      }
    );
  }
}
