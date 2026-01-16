import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
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
        const decoded = jwtDecode(response.token);
        this.userSubject.next(decoded);

        this.router.navigate(['/home']);
      })
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
}
