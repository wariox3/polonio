import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from '@app/core/services/cookie.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { catchError, map, switchMap, tap } from 'rxjs/operators';
import { AuthRepository } from '../../repositories/auth.repository';
import { loginFailure, loginRequest, loginSuccess, logout } from '../actions/login.action';
import { LOCALSTORAGE_KEYS } from '@app/core/constants/localstorage-keys.constant';
import { environment } from '@environments/environment';
import { AlertaService } from '@app/common/services/alerta.service';

@Injectable()
export class AuthEffects {
  private actions$ = inject(Actions);
  private cookieService = inject(CookieService);
  private alertaService = inject(AlertaService);
  private authRepository = inject(AuthRepository);
  private router = inject(Router);

  constructor() {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loginRequest),
      switchMap(({ credentials }) =>
        this.authRepository.login(credentials).pipe(
          map(response => {
            const cookieOptions = this.cookieService.getAuthCookieOptions(environment.cookieTime);
            // Guardar la información del usuario en una cookie para rehidratar el estado
            this.cookieService.set(
              LOCALSTORAGE_KEYS.USER,
              JSON.stringify(response.user),
              cookieOptions
            );
            this.cookieService.set(LOCALSTORAGE_KEYS.AUTH_TOKEN, response.token, cookieOptions);
            this.cookieService.set(
              LOCALSTORAGE_KEYS.REFRESH_TOKEN,
              response['refresh-token'],
              cookieOptions
            );

            this.alertaService.mostrarExito('Inicio de sesión exitoso', 'Bienvenido');

            return loginSuccess({ response });
          }),
          catchError(error => of(loginFailure({ error })))
        )
      )
    )
  );

  loginSuccess$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginSuccess),
        tap(() => {
          // Redirigir al usuario a la página principal después de un login exitoso
          this.router.navigate(['/dashboard']);
        })
      ),
    { dispatch: false }
  );

  loginFailure$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(loginFailure),
        tap(({ error }) => {
          // Aquí podrías mostrar un mensaje de error o realizar otras acciones
          console.error('Error de autenticación:', error);
        })
      ),
    { dispatch: false }
  );

  logout$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(logout),
        tap(() => {
          // Obtener las mismas opciones de dominio y path que se usaron al crear las cookies
          const cookieOptions = {
            path: '/',
            domain: this.cookieService.getDomainForCookies(),
          };

          // Eliminar cookies con las opciones correctas
          this.cookieService.delete(
            LOCALSTORAGE_KEYS.USER,
            cookieOptions.path,
            cookieOptions.domain
          );
          this.cookieService.delete(
            LOCALSTORAGE_KEYS.AUTH_TOKEN,
            cookieOptions.path,
            cookieOptions.domain
          );
          this.cookieService.delete(
            LOCALSTORAGE_KEYS.REFRESH_TOKEN,
            cookieOptions.path,
            cookieOptions.domain
          );
          this.cookieService.delete(
            LOCALSTORAGE_KEYS.CONTENEDOR,
            cookieOptions.path,
            cookieOptions.domain
          );

          this.router.navigate(['/auth/login']);
        })
      ),
    { dispatch: false }
  );
}
