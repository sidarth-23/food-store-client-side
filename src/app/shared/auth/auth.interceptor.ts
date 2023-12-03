import { HttpInterceptorFn } from '@angular/common/http';
import { UserService } from '../../services/user.service';
import { inject } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const user =  inject(UserService).currentUser
  if (user.token) {
    const token = Array.isArray(user.token) ? user.token[0] : user.token;
    const request = req.clone({
      setHeaders: {
        access_token: token,
      },
    });
    return next(request);
  }
  return next(req)
};
