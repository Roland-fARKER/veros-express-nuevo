// categoria.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {
  private obtener = 'http://localhost:3000/verosApi/v1/categoria/Obtener';
  private crear = 'http://localhost:3000/verosApi/v1/categoria/Enviar'
  private actualizar = 'http://localhost:3000/verosApi/v1/categoria/Actualizar'
  private eliminar = 'http://localhost:3000/verosApi/v1/categoria/Delete'

  constructor(private http: HttpClient) { }

  getAllCategorias(): Observable<any[]> {
    return this.http.get<any[]>(this.obtener);
  }

  getCategoriasById(id: number): Observable<any> {
    return this.http.get<any>(`${this.obtener}/${id}`);
  }

  addCategorias(categorias: any): Observable<any> {
    return this.http.post<any>(this.crear, categorias);
  }

  updateCategorias(id: number, categorias: any): Observable<any> {
    return this.http.put<any>(`${this.actualizar}/${id}`, categorias);
  }


  deleteCategorias(id: number): Observable<any> {
    return this.http.delete<any>(`${this.eliminar}/${id}`);
  }
}