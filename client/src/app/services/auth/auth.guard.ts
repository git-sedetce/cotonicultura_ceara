import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from '../cadastro.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const auth = inject(CadastroService);
  const toastr = inject(ToastrService);

  const user = auth.getUser();

  if (!user) {
    router.navigate(['/login']);
    return false;
  }

  const rolesPermitidos: number[] = route.data['roles'] ?? [];

  if (rolesPermitidos.length && !auth.hasRole(rolesPermitidos)) {
    toastr.warning('Acesso não autorizado!');
    router.navigate(['/home']);
    return false;
  }
  return true;
};
