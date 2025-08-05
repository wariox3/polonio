import { inject, Injectable } from '@angular/core';
import { HttpBaseRepository } from '@app/core/repository/http-base.repository';
import {
  ConectarResponse,
  ConsultaContenedorResponse,
  ContenedorResponse,
  InvitarUsuario,
} from '../interfaces/contenedor.interface';
import { RespuestaInvitacionUsuario } from '@app/modules/auth/interfaces/usuario.interface';

@Injectable({
  providedIn: 'root',
})
export class ContenedorRepository {
  private httpBaseRepository = inject(HttpBaseRepository);

  getMisContenedores(usuarioId: string) {
    return this.httpBaseRepository.post<ContenedorResponse>(
      '/contenedor/usuariocontenedor/consulta-usuario/',
      {
        usuario_id: usuarioId,
        reddoc: true,
      }
    );
  }

  listaUsuarios(contenedorId: number) {
    return this.httpBaseRepository.post<ConsultaContenedorResponse>(
      `/contenedor/usuariocontenedor/consulta-contenedor/`,
      {
        contenedor_id: contenedorId,
      }
    );
  }

  getDetalle(contenedorId: number) {
    return this.httpBaseRepository.get<ConectarResponse>(`/contenedor/contenedor/${contenedorId}/`);
  }

  eliminar(contenedorId: number) {
    return this.httpBaseRepository.delete(`/contenedor/contenedor/${contenedorId}/`);
  }

  invitarUsuario(payload: InvitarUsuario) {
    return this.httpBaseRepository.post<RespuestaInvitacionUsuario>(
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
