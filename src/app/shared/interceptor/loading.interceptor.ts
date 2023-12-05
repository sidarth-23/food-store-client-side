import { HttpEventType, HttpInterceptorFn } from '@angular/common/http';
import { LoadingService } from '../../services/loading.service';
import { inject } from '@angular/core';
import { tap } from 'rxjs';
import { GET_AND_PATCH_USER_FAVOURITES } from '../constants/urls';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
  var pendingRequests = 0;
  const loadingService = inject(LoadingService);

  if (req.url === GET_AND_PATCH_USER_FAVOURITES) {
    return next(req);
  }
  loadingService.showLoading();
  pendingRequests += 1;
  return next(req).pipe(
    tap({
      next: (event) => {
        if (event.type === HttpEventType.Response) {
          handleHideLoading();
        }
      },
      error: (_) => {
        handleHideLoading();
      },
    })
  );

  function handleHideLoading() {
    pendingRequests -= 1;
    if (pendingRequests === 0) {
      loadingService.hideLoading();
    }
  }
}


