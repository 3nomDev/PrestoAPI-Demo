// import { Injectable } from '@angular/core';
// import {
//   HttpRequest,
//   HttpHandler,
//   HttpEvent,
//   HttpInterceptor,
// } from '@angular/common/http';
// import { Observable, throwError } from 'rxjs';

// @Injectable({
//   providedIn: 'root',
// })
// export class InterceptorService implements HttpInterceptor {
//   constructor() {}

//   intercept(
//     req: HttpRequest<any>,
//     next: HttpHandler
//   ): Observable<HttpEvent<any>> {
//     if (this.isProtected(req)) {
//       const token = sessionStorage.getItem('token');
//       if (token) {
//         const tokenReq = req.clone({
//           setHeaders: { Authorization: `Bearer ${token}` },
//         });
//         return next.handle(tokenReq);
//       } else return throwError('This endpoint is protected');
//     }
//   }

//   isProtected(req: HttpRequest<any>) {
//     if (req.url === 'https://demo.prestoapi.com/api/login') return false;
//     if (req.url === 'https://demo.prestoapi.com/api/register') return false;
//     if (req.method === 'Get') return false;
//     return true;
//   }
// }
