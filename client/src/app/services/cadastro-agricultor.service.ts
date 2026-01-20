import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class CadastroAgricultorService {

  private agricultorEmEdicao: number | null = null;

  constructor(private http: HttpClient) {}

  cadastrarAgricultor(data: any): Observable<any> {
    return this.http.post(environment.apiUrl + 'registerAgro', data);
  }

  getCitys(metodo: string): Observable<any> {
    return this.http.get(environment.apiUrl + metodo);
  }

  getRegiaos(metodo: string): Observable<any> {
    return this.http.get(environment.apiUrl + metodo);
  }

  consultarCPF(cpf: string): Observable<any> {
    return this.http.get(environment.apiUrl + 'checkcpf/' + cpf);
  }

  consultarADAGRI(adagri: string): Observable<any> {
    return this.http.get(environment.apiUrl + 'checkcadastro/' + adagri);
  }

  agricultorRural(metodo: string): Observable<any> {
    return this.http.get(environment.apiUrl + metodo);
  }

  agricultorById(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + 'umAgricultor/' + id)
  }

  atualizarAgricultor(data: any, id: number) {
    return this.http
      .put<any>(environment.apiUrl + 'atualizaFarmer/' + id, data)
      .pipe(
        map((res: any) => {
          return res;
        }),
      );
  }

  deleteAgricultor(id: number) {
    return this.http.delete<any>(environment.apiUrl + 'farmer/' + id).pipe(
      map((res: any) => {
        return res;
      }),
    );
  }

  //EM EDIÇÃO
  setAgricultor(id: number) {
    this.agricultorEmEdicao = id;
  }

  getAgricultor(): number | null {
    return this.agricultorEmEdicao;
  }

  clear() {
    this.agricultorEmEdicao = null;
  }
}
