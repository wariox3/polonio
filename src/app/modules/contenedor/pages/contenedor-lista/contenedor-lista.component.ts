import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { AdvancedButtonComponent } from '@app/common/components/ui/advanced-button/advanced-button.component';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { Contenedor } from '../../interfaces/contenedor.interface';
import { ContenedorRepository } from '../../repositories/contenedor.repository';
import { CommonModule } from '@angular/common';
import { finalize, Observable } from 'rxjs';
import { ModalStandardComponent } from '@app/common/components/ui/modals/modal-standard/modal-standard.component';
import { ModalService } from '@app/common/services/modal.service';
import { ContenedorEliminarComponent } from '../../components/contenedor-eliminar/contenedor-eliminar.component';
import { ContenedorInvitarComponent } from '../../components/contenedor-invitar/contenedor-invitar.component';
import {
  ContenedorActionBorrarInformacion,
  ContenedorActionInit,
} from '../../store/actions/contenedor.action';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contenedor',
  standalone: true,
  imports: [
    AdvancedButtonComponent,
    CommonModule,
    ModalStandardComponent,
    ContenedorEliminarComponent,
    ContenedorInvitarComponent,
  ],
  templateUrl: './contenedor-lista.component.html',
  styleUrl: './contenedor-lista.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContenedorListaComponent implements OnInit {
  private contenedorRepository = inject(ContenedorRepository);
  private modalService = inject(ModalService);
  private store = inject(Store);
  private route = inject(Router);

  public contenedores = signal<Contenedor[]>([]);
  public loaders = signal<boolean[]>([]);
  public usuarioId = signal<string>('');
  public contenedorSeleccionado = signal<Contenedor | null>(null);

  ngOnInit(): void {
    this.initStoreData();
    this.getContenedores();
    this.store.dispatch(ContenedorActionBorrarInformacion());
  }

  initStoreData() {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.usuarioId.set(user.id);
    });
  }

  getContenedores() {
    this.contenedorRepository.getMisContenedores(this.usuarioId()).subscribe(resp => {
      this.loaders.set(resp.contenedores.map(() => false));
      this.contenedores.set(resp.contenedores);
    });
  }

  conectarContenedor(contenedorId: number, idx: number) {
    this.loaders.update(prev => {
      const newLoaders = [...prev];
      newLoaders[idx] = true;
      return newLoaders;
    });

    this.contenedorRepository
      .getDetalle(contenedorId)
      .pipe(
        finalize(() => {
          this.loaders.update(prev => {
            const newLoaders = [...prev];
            newLoaders[idx] = false;
            return newLoaders;
          });
        })
      )
      .subscribe(respuesta => {
        const contenedor: Contenedor = {
          id: 0,
          usuario_id: respuesta.usuario_id,
          contenedor_id: respuesta.id,
          rol: '',
          plan_id: respuesta.plan_id,
          subdominio: respuesta.subdominio,
          nombre: respuesta.nombre,
          imagen: respuesta.imagen,
          usuarios: respuesta.plan_limite_usuarios,
          usuarios_base: respuesta.plan_usuarios_base,
          plan_nombre: respuesta.plan_nombre,
          reddoc: respuesta.reddoc,
          ruteo: respuesta.ruteo,
          acceso_restringido: respuesta.acceso_restringido,
          seleccion: true,
        };

        this.store.dispatch(ContenedorActionInit({ contenedor }));
        this.route.navigateByUrl('/dashboard');
      });
  }

  eliminarContenedor(contenedor: Contenedor) {
    this.contenedorSeleccionado.set(contenedor);
    this.abrirModal('eliminarContenedor');
  }

  invitarContenedor(contenedor: Contenedor) {
    this.contenedorSeleccionado.set(contenedor);
    this.abrirModal('invitarContenedor');
  }

  abrirModal(id: string) {
    this.modalService.open(id);
  }

  getModalInstaceState(id: string): Observable<boolean> {
    return this.modalService.isOpen$(id);
  }
}
