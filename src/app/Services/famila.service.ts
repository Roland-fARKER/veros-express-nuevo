// familia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

export interface Familia {
  id: number;
  Nombre_familia: string;
}

@Injectable({
  providedIn: 'root',
})
export class FamiliaService {
  private apiUrl = 'https://verosback-default--production-roland-farker.sierranegra.cloud/verosApi/v1/familias';

  constructor(private http: HttpClient) {}

  getAllFamilias(): Observable<Familia[]> {
    return this.http.get<Familia[]>(this.apiUrl + '/Obtener');
  }

  addFamilia(Nombre_familia: string): Observable<void> {
    //recibe el string que se le manda y lo encapsula
    const nuevoFamilia = { Nombre_familia: Nombre_familia };
    //li imprime para verificar este bein la encapsulación
    console.log(nuevoFamilia)
    //envía una petición post a la url del API con el objeto que contiene el nombre
    return this.http.post<void>(`${this.apiUrl}/Enviar`, nuevoFamilia);
  }

  updateFamilia(id: number, familiaData: { Nombre_familia: string }): Observable<void> {
    //obtiene el id y los datos a actualizar y los imprime 
    console.log(familiaData);
    //se envia la petición
    return this.http.patch<void>(
      `${this.apiUrl}/Actualizar/${id}`,
      familiaData
    );
  }

  deleteFamilia(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id}`);
  }
}

