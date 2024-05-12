// catalogo.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Catalogo {
  id_catalogo: number;
  Stock: number | undefined;
  Id_Producto: number;
  Id_Almacen: number;
}

@Injectable({
  providedIn: 'root',
})
export class CatalogoService {
  private apiUrl = 'https://verosback-default--production-roland-farker.sierranegra.cloud/verosApi/v1/catalogo';
  

  constructor(private http: HttpClient) {}

  getAllCatalogo(): Observable<Catalogo[]> {
    return this.http.get<Catalogo[]>(this.apiUrl + '/Obtener');
  }

  addCatalogo(catalogo: Catalogo): Observable<Catalogo> {
   
    const { id_catalogo, ...catalogoWithoutId } = catalogo;

    catalogoWithoutId.Stock = Number(catalogoWithoutId.Stock);

    const apiUrlWithAction = `${this.apiUrl}/Enviar`;
    console.log(catalogoWithoutId);
    return this.http.post<Catalogo>(apiUrlWithAction, catalogoWithoutId);
  }

  deleteCatalogo(id_catalogo: number): Observable<void> {
    const url = `${this.apiUrl}/Delete/${id_catalogo}`;
    return this.http.delete<void>(url);
  }
}

