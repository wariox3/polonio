import { ChangeDetectionStrategy, ChangeDetectorRef, Component, inject, Input, OnInit, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { LabelComponent } from '@app/common/components/ui/form/label/label.component';
import { AlertaService } from '@app/common/services/alerta.service';
import { selectCurrentUser } from '@app/modules/auth/store/selectors/auth.selector';
import { Store } from '@ngrx/store';
import { AdvancedButtonComponent } from '@app/common/components/ui/advanced-button/advanced-button.component';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { Contenedor, Usuario } from '../../interfaces/contenedor.interface';
import { ContenedorRepository } from '../../repositories/contenedor.repository';

@Component({
  selector: 'app-contenedor-invitar',
  standalone: true,
  imports: [LabelComponent, ReactiveFormsModule, InputComponent, AdvancedButtonComponent],
  templateUrl: 'contenedor-invitar.component.html',
  styleUrl: './contenedor-invitar.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContenedorInvitarComponent implements OnInit {
  @Input({ required: true }) contenedor: Contenedor;

  private contenedorRepository = inject(ContenedorRepository);
  private changeDetectorRef = inject(ChangeDetectorRef);
  private _formBuilder = inject(FormBuilder);
  private store = inject(Store);
  private alerta = inject(AlertaService);
  private usuarioId = '';

  public listaUsuarios = signal<Usuario[]>([]);
  formularioInvitacionUsuario = this._formBuilder.group({
    nombre: ['', [Validators.email, Validators.required]],
  });

  ngOnInit(): void {
    this._consultarContenedorUsuarios(this.contenedor.contenedor_id);
    this._loadInitialData();
  }

  private _loadInitialData() {
    this.store.select(selectCurrentUser).subscribe(user => {
      this.usuarioId = user.id;
    });
  }

  private _consultarContenedorUsuarios(contenedorId: number) {
    this.contenedorRepository.listaUsuarios(contenedorId).subscribe(response => {
      this.listaUsuarios.set(response.usuarios);
    });
  }

  private _limpiarFormulario() {
    this.formularioInvitacionUsuario.reset();
    this.formularioInvitacionUsuario.controls.nombre.setValue('');
    this.formularioInvitacionUsuario.controls.nombre.markAsUntouched();
    this.formularioInvitacionUsuario.controls.nombre.markAsPristine();
    this.changeDetectorRef.detectChanges();
  }

  enviarInvitacionUsuario(contenedorId: number) {
    this.contenedorRepository
      .invitarUsuario({
        accion: 'invitar',
        contenedor_id: contenedorId,
        usuario_id: this.usuarioId,
        invitado: this.formularioInvitacionUsuario.controls.nombre.value,
      })
      .subscribe(() => {
        this.alerta.mostrarExito('Se ha enviado un correo de invitación.');
        this._limpiarFormulario();
      });
  }
}
