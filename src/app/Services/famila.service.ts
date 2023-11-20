// familia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FamiliaService {
  private obtener = 'http://localhost:3000/verosApi/v1/familias/Obtener'; 
  private crear = 'http://localhost:3000/verosApi/v1/familias/Enviar'
  private actualizar = 'http://localhost:3000/verosApi/v1/familias/Actualizar'
  private eliminar = 'http://localhost:3000/verosApi/v1/familias/Delete'

  constructor(private http: HttpClient) {}

  getAllFamilias(): Observable<any[]> {
    return this.http.get<any[]>(this.obtener);
  }

  getFamiliaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.obtener}/${id}`);
  }

  addFamilia(familia: any): Observable<any> {
    return this.http.post<any>(this.crear, familia);
  }

  updateFamilia(id: number, familia: any): Observable<any> {
    return this.http.put<any>(`${this.actualizar}/${id}`, familia);
  }

  deleteFamilia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.eliminar}/${id}`);
  }
}