import { inject, Injectable } from '@angular/core';
import { LOCALSTORAGE_KEYS } from '@app/core/constants/localstorage-keys.constant';
import { CookieService } from '@app/core/services/cookie.service';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap } from 'rxjs/operators';
import { Contenedor } from '../../interfaces/contenedor.interface';
import {
  ContenedorActionBorrarInformacion,
  ContenedorActionInit,
} from '../actions/contenedor.action';
import { environment } from '@environments/environment';

@Injectable()
export class ContenedorEffects {
  private cookieService = inject(CookieService);
  private actions$ = inject(Actions);

  guardarConenedor$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContenedorActionInit),
        tap((action: { contenedor: Contenedor }) => {
          const tiempo = this.cookieService.calcularTiempoCookie(environment.cookieTime);
          this.cookieService.set(LOCALSTORAGE_KEYS.CONTENEDOR, JSON.stringify(action.contenedor), {
            expires: tiempo,
            path: '/',
          });
        })
      ),
    { dispatch: false }
  );

  eliminarContenedor$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(ContenedorActionBorrarInformacion),
        tap(() => {
          const cookieKeysLimpiar = [LOCALSTORAGE_KEYS.CONTENEDOR];
          cookieKeysLimpiar.map(cookieKey => {
            this.cookieService.delete(cookieKey, '/');
          });
        })
      ),
    { dispatch: false }
  );
}
