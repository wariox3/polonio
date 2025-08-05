import { inject } from '@angular/core';
import { Router, type CanMatchFn } from '@angular/router';
import { LOCALSTORAGE_KEYS } from '@app/core/constants/localstorage-keys.constant';
import { CookieService } from '@app/core/services/cookie.service';

export const contenedorGuard: CanMatchFn = () => {
  const router = inject(Router);
  const cookieService = inject(CookieService);
  const contenedor = cookieService.get(LOCALSTORAGE_KEYS.CONTENEDOR);

  if (!contenedor) {
    router.navigate(['/contenedor']);
    return false;
  }

  return true;
};
