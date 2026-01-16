import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { CadastroService } from '../cadastro.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private auth: CadastroService,
    private toastr: ToastrService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const token = this.auth.getToken();

    // Adiciona o token no header automaticamente
    const authReq = token
      ? req.clone({
          setHeaders: { Authorization: `Bearer ${token}` }
        })
      : req;

    return next.handle(authReq).pipe(
      catchError((error: HttpErrorResponse) => {

        // 🔥 Aqui você trata token expirado
        if (error.status === 403) {
          this.toastr.warning('Sessão expirada! Faça login novamente.');
          this.auth.logout();
        }

        if (error.status === 401) {
          this.toastr.warning('Usuário não autenticado!');
          this.auth.logout();
        }

        return throwError(() => error);
      })
    );
  }
}
