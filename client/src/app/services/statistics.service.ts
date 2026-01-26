import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class StatisticsService {
  constructor(private http: HttpClient) {}

  contarAgricultores(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'totalAgricultores', data);
  }

  contarMunicipio(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'countPorMunicipio', data);
  }

  contarRegiao(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'countPorRegiao', data);
  }

  contarAtendidos(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'countAtendidos', data);
  }

  sementesDistribuidas(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'totalSementesDistribuidas', data);
  }

  sementesDistribuidasPorRegiao(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'sementesPorRegiao', data);
  }

  sementesDistribuidasPorMunicipio(data: any): Observable<any> {
    return this.http.get(environment.apiUrl + 'sementesPorMunicipio', data);
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
}
