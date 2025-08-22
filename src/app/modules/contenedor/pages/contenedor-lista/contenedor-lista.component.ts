import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AdvancedButtonComponent } from '@app/common/components/ui/advanced-button/advanced-button.component';
import { ModalService } from '@app/common/services/modal.service';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, finalize, Observable, Subject } from 'rxjs';
import { Contenedor, ContenedorLista } from '../../interfaces/contenedor.interface';
import { ContenedorRepository } from '../../repositories/contenedor.repository';
import {
  ContenedorActionBorrarInformacion,
  ContenedorActionInit,
} from '../../store/actions/contenedor.action';
import { QueryParams } from '@app/core/interfaces/api.interface';
import { environment } from '@environments/environment';
import { FormsModule } from '@angular/forms';
import { PaginadorComponent } from '@app/common/components/ui/paginador/paginador.component';

@Component({
  selector: 'app-contenedor',
  standalone: true,
  imports: [AdvancedButtonComponent, CommonModule, FormsModule, PaginadorComponent],
  templateUrl: './contenedor-lista.component.html',
  styleUrl: './contenedor-lista.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class ContenedorListaComponent implements OnInit {
  private contenedorRepository = inject(ContenedorRepository);
  private modalService = inject(ModalService);
  private store = inject(Store);
  private route = inject(Router);
  private searchTerms = new Subject<string>();

  public contenedores = signal<ContenedorLista[]>([]);
  public loaders = signal<boolean[]>([]);
  public usuarioId = signal<string>('');
  public contenedorSeleccionado = signal<Contenedor | null>(null);
  public currentPage = signal<number>(1);
  public digitalOceanUrl = environment.digitalOceanUrl;
  public searchTerm = '';

  ngOnInit(): void {
    this.initStoreData();
    this.initSearchContenedor();
    this.getContenedores();
    this.store.dispatch(ContenedorActionBorrarInformacion());
  }

  initSearchContenedor() {
    this.searchTerms.pipe(debounceTime(500), distinctUntilChanged()).subscribe(term => {
      this.searchTerm = term;
      this.getContenedores();
    });
  }

  initStoreData() {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.usuarioId.set(user.id);
    });
  }

  getContenedores() {
    const params: QueryParams = {
      usuario_id: this.usuarioId(),
      page: this.currentPage(),
    };

    if (this.searchTerm) {
      params['contenedor__nombre'] = this.searchTerm;
    }

    this.contenedorRepository.getMisContenedores(params).subscribe(resp => {
      this.loaders.set(resp.results.map(() => false));
      this.contenedores.set(resp.results);
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

  onSearchChange(term: string) {
    this.currentPage.set(1);
    this.searchTerms.next(term);
  }

  cambiarPaginacion(page: number) {
    this.currentPage.set(page);
    this.getContenedores();
  }

  get totalItems(): number {
    return this.contenedorRepository.totalItems() || 0;
  }
}
