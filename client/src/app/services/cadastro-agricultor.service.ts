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

  agricultorRural(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'allFarmers', { params: { status: data } });
  }

  agricultorById(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + 'umAgricultor/' + id)
  }

  pegarCidade(city: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'takeCity/' + city)
  }

  farmersByCity(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + 'agricultorByCity/' + id)
  }

  desistirPrograma(data: any, id: number): Observable<any> {
    return this.http.patch(environment.apiUrl + 'desistir/' + id, data)
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

  adicionarDistribuicoes(id: number, distribuicoes: any[]) {
    return this.http.post<any>(
      environment.apiUrl + 'adicionaDistribuicoes/' + id,
      { distribuicoes },
    );
  }

  atualizarAtendimentos(id: number, distribuicoes: any[]) {
    return this.http.patch<any>(
      environment.apiUrl + 'atualizaAtendimentoDistribuicoes/' + id,
      { distribuicoes },
    );
  }

  perfilProdutor(): Observable<any> {
    return this.http.get(environment.apiUrl + 'perfilProdutor');
  }

  atualizarPerfilProdutor(data: any): Observable<any> {
    return this.http.put(environment.apiUrl + 'perfilProdutor', data);
  }

  solicitarSementes(areaAlgodao: number): Observable<any> {
    return this.http.post(environment.apiUrl + 'perfilProdutor/pedidos', {
      area_algodao: areaAlgodao,
    });
  }

  substituirAnexoProdutor(tipo: string, arquivo: File): Observable<any> {
    const dados = new FormData();
    dados.append('file', arquivo);
    return this.http.put(
      environment.apiUrl + 'perfilProdutor/anexos/' + tipo,
      dados,
    );
  }

  pegarAnexoProdutor(tipo: string): Observable<any> {
    return this.http.get(
      environment.apiUrl + 'perfilProdutor/anexos/' + tipo,
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
