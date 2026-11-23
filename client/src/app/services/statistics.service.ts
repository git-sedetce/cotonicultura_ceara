import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  anosDisponiveis(): Observable<number[]> {
    return this.http.get<number[]>(environment.apiUrl + 'anosDisponiveis');
  }

  contarAgricultores(ano?: number | null): Observable<any> {
    return this.http.get(environment.apiUrl + 'totalAgricultores', this.opcoesAno(ano));
  }

  contarMunicipio(ano?: number | null): Observable<any> {
    return this.http.get(environment.apiUrl + 'countPorMunicipio', this.opcoesAno(ano));
  }

  contarRegiao(ano?: number | null): Observable<any> {
    return this.http.get(environment.apiUrl + 'countPorRegiao', this.opcoesAno(ano));
  }

  contarAtendidos(ano?: number | null): Observable<any> {
    return this.http.get(environment.apiUrl + 'countAtendidos', this.opcoesAno(ano));
  }

  sementesDistribuidas(ano?: number | null): Observable<any> {
    return this.http.get(environment.apiUrl + 'totalSementesDistribuidas', this.opcoesAno(ano));
  }

  sementesDistribuidasPorRegiao(ano?: number | null): Observable<any> {
    return this.http.get(environment.apiUrl + 'sementesPorRegiao', this.opcoesAno(ano));
  }

  sementesDistribuidasPorAno(): Observable<any> {
    return this.http.get(environment.apiUrl + 'sementesPorAno');
  }

  sementesDistribuidasPorMunicipio(): Observable<any> {
    return this.http.get(environment.apiUrl + 'sementesPorMunicipio');
  }

  estatiticaCultivo(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'countPorTipoCultivo', data);
  }

  somaAreaCultivoMunicipio(ano?: number | null): Observable<any> {
    return this.http.get(environment.apiUrl + 'hectareMunicipio', this.opcoesAno(ano));
  }

  somaAreaCultivoRegiao(ano?: number | null): Observable<any> {
    return this.http.get(environment.apiUrl + 'hectareRegiao', this.opcoesAno(ano));
  }

  areaParaCultivar(ano?: number | null): Observable<any> {
    return this.http.get(environment.apiUrl + 'totalAreaCultivo', this.opcoesAno(ano));
  }

  areaParaTrabalhar(ano?: number | null): Observable<any> {
    return this.http.get(environment.apiUrl + 'totalAreaCultivoTrabalhado', this.opcoesAno(ano));
  }

  dadosMapa(): Observable<any> {
    return this.http.get(environment.apiUrl + 'mapa');
  }

  private opcoesAno(ano?: number | null): { params: { ano: number } } | {} {
    return ano == null ? {} : { params: { ano } };
  }
}
