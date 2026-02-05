import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  contarAgricultores(): Observable<any> {
    return this.http.get(environment.apiUrl + 'totalAgricultores');
  }

  contarMunicipio(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'countPorMunicipio', data);
  }

  contarRegiao(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'countPorRegiao', data);
  }

  contarAtendidos(): Observable<any> {
    return this.http.get(environment.apiUrl + 'countAtendidos');
  }

  sementesDistribuidas(): Observable<any> {
    return this.http.get(environment.apiUrl + 'totalSementesDistribuidas');
  }

  sementesDistribuidasPorRegiao(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'sementesPorRegiao', data);
  }

  sementesDistribuidasPorMunicipio(): Observable<any> {
    return this.http.get(environment.apiUrl + 'sementesPorMunicipio');
  }

  estatiticaCultivo(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'countPorTipoCultivo', data);
  }

  somaAreaCultivoMunicipio(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'hectareMunicipio', data);
  }

  somaAreaCultivoRegiao(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'hectareRegiao', data);
  }

  areaParaCultivar(): Observable<any> {
    return this.http.get(environment.apiUrl + 'totalAreaCultivo');
  }

  dadosMapa(): Observable<any> {
    return this.http.get(environment.apiUrl + 'mapa');
  }
}
