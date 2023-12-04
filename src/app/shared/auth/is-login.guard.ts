import { CanActivateFn, Router } from '@angular/router';
import { UserService } from '../../services/user.service';
import { inject } from '@angular/core';

export const isLoginGuard: CanActivateFn = (route, state) => {
  const router: Router = inject(Router);
  const userService: UserService = inject(UserService);

  if (!userService.currentUser?.token) {
    return true;
  }

  router.navigate(['/home']);
  return false;
};
