import { HttpInterceptorFn } from '@angular/common/http';
import { environment as env } from '../../../environments/environment';

export const requestInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req.clone({ 
    url: env.baseUrl + req.url,
  }));
};
