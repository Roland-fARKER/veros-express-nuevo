// proveedores.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../Models/proveedor.model';

@Injectable({
  providedIn: 'root',
})
export class ProveedoresService {
  private apiUrl = 'http://localhost:3000/verosApi/v1/proveedores';

  constructor(private http: HttpClient) {}

  getAllProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(`${this.apiUrl}/obtener`);
  }

  getProveedorById(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.apiUrl}/Obtener/${id}`);
  }

  addProveedor(proveedor: Proveedor): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/Enviar`, proveedor);
  }

  updateProveedor(id: number, proveedor: Proveedor): Observable<any> {
    return this.http.patch<any>(`${this.apiUrl}/Actualizar/${id}`, proveedor);
  }

  deleteProveedor(id: number): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/Delete/${id}`);
  }
}