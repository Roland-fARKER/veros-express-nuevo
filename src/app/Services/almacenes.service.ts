// almacene.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface Almacene {
  id: number;
  nombre: string;
  
}

@Injectable({
  providedIn: 'root',
})
export class AlmaceneService {
  private apiUrl = 'https://verosback-default--production-roland-farker.sierranegra.cloud/verosApi/v1/almacenes'; 

  constructor(private http: HttpClient) {}

  getAllAlmacenes(): Observable<Almacene[]> {
    //solucitud http para obtener los alacenes guardados en la base de datos
    return this.http.get<Almacene[]>(this.apiUrl + '/Obtener');
  }

  addAlmacene(nombre: string): Observable<any> {
    //recibe el string que se le manda y lo encapsula
    const nuevoAlmacene = { nombre: nombre };
    //li imprime para verificar este bein la encapsulación
    console.log(nuevoAlmacene)
    //envía una petición post a la url del API con el objeto que contiene el nombre
    return this.http.post<any>(`${this.apiUrl}/Enviar`, nuevoAlmacene);
  }

  updateAlmacene(id: number, almaceneData: { nombre: string }): Observable<void> {
    //obtiene el id y los datos a actualizar y los imprime 
    console.log(almaceneData);
    //se envia la petición
    return this.http.patch<void>(
      `${this.apiUrl}/Actualizar/${id}`,
      almaceneData
    );
  }

  deleteAlmacene(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Eliminar/${id}`);
  }
}
