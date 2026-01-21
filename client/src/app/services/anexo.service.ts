import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
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

  pegarArquivos(id: number, tipo_anexo: string): Observable<any> {
  return this.http.get(
    `${environment.apiUrl}getFile/${id}`,
    {
      params: { tipo_anexo }
    }
  );
}

  atualizAnexo(dados: any, id: any) : Observable<any> {
    return this.http.put(environment.apiUrl + 'updateFile/' + id, dados)
    .pipe(map((res:any) => {
      return res;
    }));
  }

  deleteAnexo(id: number){
      return this.http.delete<any>(environment.apiUrl + 'deleteAnexo/' +id)
      .pipe(map((res:any)=>{
        return res;
      }))
    }
}
