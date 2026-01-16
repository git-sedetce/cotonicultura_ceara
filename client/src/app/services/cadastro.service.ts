import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Md5 } from 'ts-md5';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CadastroService {
  CriptografarMD5(value: string | undefined): string | undefined {
    return Md5.hashStr(value!).toString();
  }

  constructor(private http: HttpClient, private router: Router) { }

  authenticated = false;

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
