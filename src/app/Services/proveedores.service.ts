// proveedor.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Proveedor {
  id: number;
  nombre: string;
  telefono: number;
  estado: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProveedorService {
  private apiUrl = 'https://verosback-default--production-roland-farker.sierranegra.cloud/verosApi/v1/proveedores'; 

  constructor(private http: HttpClient) {}

  getAllProveedores(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.apiUrl + '/obtener');
  }

  addProveedor(proveedor: Proveedor): Observable<Proveedor> {

    // Agrega la palabra "Agregar" a la URL
    const apiUrlWithAction = `${this.apiUrl}/Enviar`;

    // Elimina el ID antes de enviar la solicitud al backend
    const { id, ...proveedorWithoutId } = proveedor;
  
    // Convertir el campo "telefono" a tipo number
    proveedorWithoutId.telefono = Number(proveedorWithoutId.telefono);
  
    console.log(proveedorWithoutId);
    return this.http.post<Proveedor>(apiUrlWithAction, proveedorWithoutId);
  }
  
  updateProveedor(id: number, proveedor: Proveedor): Observable<Proveedor> {
    const { id: proveedorId, ...proveedorWithoutId } = proveedor;

    proveedorWithoutId.telefono = Number(proveedorWithoutId.telefono);
    const url = `${this.apiUrl}/Actualizar/${id}`;
    console.log(proveedorWithoutId);
    return this.http.patch<Proveedor>(url, proveedorWithoutId);
  }

  deleteProveedor(id: number): Observable<void> {
    const url = `${this.apiUrl}/Delete/${id}`;
    return this.http.delete<void>(url);
  }
}
