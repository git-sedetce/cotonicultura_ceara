import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CadastroAgricultorService {
  constructor(private http: HttpClient) {}

  cadastrarAgricultor(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + 'registerAgro', data);
  }

  getCitys(metodo: string): Observable<any> {
    return this.http.get(environment.apiUrl + metodo);
  }

  consultarCPF(cpf: string): Observable<any> {
    return this.http.get(environment.apiUrl + 'checkcpf/' + cpf);
  }

  consultarADAGRI(adagri: string): Observable<any> {
    return this.http.get(environment.apiUrl + 'checkcadastro/' + adagri);
  }
}
