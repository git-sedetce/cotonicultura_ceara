import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, map, Observable, tap, throwError } from 'rxjs';
import { Md5 } from 'ts-md5';
import { environment } from '../../environments/environment';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {

  private userSubject = new BehaviorSubject<any>(null);
  user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient, private router: Router) { this.loadUserFromToken(); }

  // ------ UTILIDADES ------ //

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof localStorage !== 'undefined';
  }

  private loadUserFromToken() {
    if (!this.isBrowser()) return;

    const token = this.getToken();
    if (!token) return;

    try {
      const decoded = jwtDecode<any>(token);
      this.userSubject.next(decoded);
    } catch (e) {
      this.userSubject.next(null);
    }
  }

  CriptografarMD5(value: string | undefined): string | undefined {
    return Md5.hashStr(value!).toString();
  }

  getToken(): string | null {
    if (!this.isBrowser()) return null;
    return localStorage.getItem('access_token');
  }

  getUser() {
    return this.userSubject.value;
  }

   isLogged(): boolean {
    return !!this.userSubject.value;
  }

  hasRole(roles: number[]): boolean {
    const user = this.getUser();
    return user && roles.includes(user._profile_id);
  }

  // ------ AUTENTICAÇÃO ------ //

  login(data: any): Observable<any> {
    return this.http.post<any>(environment.apiUrl + 'login', data).pipe(
      tap((response) => {
        localStorage.setItem('access_token', response.token);
        const decoded: any = jwtDecode(response.token);
        this.userSubject.next(decoded);

        this.router.navigate([decoded._user_type === 'producer' ? '/perfil' : '/admin']);
      })
    );
  }

  primeiroAcessoProdutor(data: any): Observable<any> {
    return this.http
      .post<any>(environment.apiUrl + 'primeiroAcessoProdutor', data)
      .pipe(
        tap((response) => {
          if (this.isBrowser()) {
            localStorage.removeItem('access_token');
            sessionStorage.setItem('producer_reset_token', response.resetToken);
            this.userSubject.next(null);
          }
        }),
      );
  }

  possuiTokenResetProdutor(): boolean {
    return (
      typeof sessionStorage !== 'undefined' &&
      !!sessionStorage.getItem('producer_reset_token')
    );
  }

  resetarSenhaProdutor(senha: string): Observable<any> {
    if (!this.possuiTokenResetProdutor()) {
      return throwError(() => new Error('A validação do primeiro acesso expirou.'));
    }

    return this.http
      .post<any>(environment.apiUrl + 'resetSenhaProdutor', {
        reset_token: sessionStorage.getItem('producer_reset_token'),
        user_password: this.CriptografarMD5(senha),
      })
      .pipe(
        tap(() => {
          sessionStorage.removeItem('producer_reset_token');
          this.userSubject.next(null);
        }),
      );
  }

  logout() {
    localStorage.removeItem('access_token');
    this.userSubject.next(null);
    this.router.navigate(['/login']);
  }

  // ------ REQUISIÇÕES ------ //

    cadastrar_users(data:any):Observable<any> {
      return this.http.post(environment.apiUrl + 'register', data)
    }

    pegar_secretaria(metodo: string): Observable<any> {
      return this.http.get(environment.apiUrl + metodo)
    }

    consultarEmail(email: string) : Observable<any> {
      return this.http.get(environment.apiUrl + 'checkEmail/' + email)
    }

    pegar_users(metodo: string): Observable<any> {
      return this.http.get(environment.apiUrl + metodo)
    }

    pegar_perfil(metodo: string): Observable<any> {
      return this.http.get(environment.apiUrl + metodo)
    }

    resetPin(data:any): Observable<any> {
      return this.http.post(environment.apiUrl + 'newPin',  data)
    }

    atualizarUser(data: any, id: number){
      return this.http.put<any>(environment.apiUrl + 'atualizaUser/' +id, data)
      .pipe(map((res:any)=>{
        return res;
      }))
    }

    deleteUser(id: number){
      return this.http.delete<any>(environment.apiUrl + 'user/' +id)
      .pipe(map((res:any)=>{
        return res;
      }))
    }

    reset_password(data:any) : Observable<any> {
      return this.http.post(environment.apiUrl + 'reset', data)
    }

}
