import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AnexoService {

  constructor(private http: HttpClient) { }

  checarArquivos(id: number): Observable<any> {
    return this.http.get(environment.apiUrl + 'checkAnexoById/' + id)
  }
}
