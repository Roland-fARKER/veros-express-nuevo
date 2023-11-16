// familia.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class FamiliaService {
  private apiUrl = 'http://localhost:3000/verosApi/v1/familias'; // Reemplaza con la URL de tu servidor NestJS

  constructor(private http: HttpClient) {}

  getAllFamilias(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  getFamiliaById(id: number): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  addFamilia(familia: any): Observable<any> {
    return this.http.post<any>(this.apiUrl, familia);
  }

  updateFamilia(id: number, familia: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, familia);
  }

  deleteFamilia(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}