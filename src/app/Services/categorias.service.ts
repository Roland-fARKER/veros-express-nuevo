// categoria.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Categorias {
  id_categoria: number;
  Nombre_Categoria: string;
}

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private apiUrl = 'https://verosback-default--production-roland-farker.sierranegra.cloud/verosApi/v1/categoria';

  constructor(private http: HttpClient) {}

  getAllCategorias(): Observable<Categorias[]> {
    return this.http.get<Categorias[]>(this.apiUrl + '/Obtener');
  }

  addCategorias(Nombre_Categoria: string): Observable<void> {
    //recibe el string que se le manda y lo encapsula
    const nuevoCategoria = { Nombre_Categoria: Nombre_Categoria };
    //li imprime para verificar este bein la encapsulación
    console.log(nuevoCategoria)
    //envía una petición post a la url del API con el objeto que contiene el nombre
    return this.http.post<void>(`${this.apiUrl}/Enviar`, nuevoCategoria);
  }

  updateCategorias(id_categoria: number, categoriaData: { Nombre_Categoria: string }): Observable<void> {
    //obtiene el id y los datos a actualizar y los imprime 
    console.log(categoriaData);
    //se envia la petición
    return this.http.patch<void>(
      `${this.apiUrl}/Actualizar/${id_categoria}`,
      categoriaData
    );
  }

  deleteCategorias(id_categoria: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/Delete/${id_categoria}`);
  }
}