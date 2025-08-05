import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  Input,
  Output,
} from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { BehaviorSubject, catchError, finalize, of } from 'rxjs';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { Contenedor } from '../../interfaces/contenedor.interface';
import { ContenedorRepository } from '../../repositories/contenedor.repository';
import { AlertaService } from '@app/common/services/alerta.service';
import { AdvancedButtonComponent } from '@app/common/components/ui/advanced-button/advanced-button.component';
import { ModalService } from '@app/common/services/modal.service';

@Component({
  selector: 'app-contenedor-eliminar',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, AdvancedButtonComponent],
  templateUrl: './contenedor-eliminar.component.html',
  styleUrl: './contenedor-eliminar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContenedorEliminarComponent {
  @Input({ required: true }) contenedor: Contenedor;
  @Output() emitirContenedorEliminado: EventEmitter<any> = new EventEmitter();

  private contenedorRepository = inject(ContenedorRepository);
  private alertaService = inject(AlertaService);
  private modalService = inject(ModalService);
  public estaEliminandoContenedor$ = new BehaviorSubject<boolean>(false);

  formularioEliminar = new FormGroup({
    nombre: new FormControl('', Validators.compose([Validators.required])),
  });

  cerrarModal() {
    this.modalService.close('eliminarContenedor');
  }

  eliminarContenedor() {
    if (this.formularioEliminar.get('nombre')?.value.trim() === this.contenedor.subdominio.trim()) {
      const contenedorId = this.contenedor.contenedor_id;
      this.estaEliminandoContenedor$.next(true);

      this.contenedorRepository
        .eliminar(contenedorId)
        .pipe(
          catchError(() => {
            this.emitirContenedorEliminado.emit(true);
            return of(null);
          }),
          finalize(() => {
            this.estaEliminandoContenedor$.next(false);
            this.cerrarModal();
          })
        )
        .subscribe(() => {
          this.emitirContenedorEliminado.emit(true);
          this.alertaService.mostrarExito('Se eliminó correctamente el contenedor.');
        });
    }
  }
}
