import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InputComponent } from '@app/common/components/ui/form/input/input.component';
import { AuthRepository } from '../../repositories/auth.repository';
import { AdvancedButtonComponent } from '@app/common/components/ui/advanced-button/advanced-button.component';
import { finalize } from 'rxjs';
import { RouterLink } from '@angular/router';
import { matchFieldsValidator } from '@app/common/validators/match-field.validator';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, InputComponent, AdvancedButtonComponent, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export default class RegisterComponent {
  private authService = inject(AuthRepository);

  public registrando = signal<boolean>(false);
  public formularioRegister = new FormGroup(
    {
      username: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      confirmarContrasena: new FormControl('', Validators.required),
      terminoCondicion: new FormControl(false, Validators.required),
    },
    {
      validators: [matchFieldsValidator('password', 'confirmarContrasena')],
    }
  );

  register() {
    this.registrando.set(true);
    this.authService
      .register({
        username: this.formularioRegister.get('username')?.value,
        password: this.formularioRegister.get('password')?.value,
        confirmarContrasena: this.formularioRegister.get('confirmarContrasena')?.value,
        terminoCondicion: this.formularioRegister.get('terminoCondicion')?.value,
      })
      .pipe(finalize(() => this.registrando.set(false)))
      .subscribe();
  }
}
