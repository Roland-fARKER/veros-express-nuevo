import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AlmacenesService {
  private obtener = 'http://localhost:3000/verosApi/v1/almacenes/Obtener';
  private crear = 'http://localhost:3000/verosApi/v1/almacenes/Crear';
  private actualizar = 'http://localhost:3000/verosApi/v1/almacenes/Actualizar';
  private eliminar = 'http://localhost:3000/verosApi/v1/almacenes/Eliminar';


  constructor(private http: HttpClient) {}

  getAllAlmacenes(): Observable<any[]> {
    return this.http.get<any[]>(this.obtener);
  }

  getAlmacenesById(id: number): Observable<any> {
    return this.http.get<any>(`${this.obtener}/${id}`);
  }

  addAlmacenes(almacenes: any): Observable<any> {
    return this.http.post<any>(this.crear, almacenes).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error al agregar almacén:', error);
        if (error.error && error.error.message) {
          console.error('Mensaje de error del servidor:', error.error.message);
        }
        throw error; // Reenviar el error para que se maneje en el componente
      })
    );
  }

  updateAlmacenes(id: number, almacenes: any): Observable<any> {
    return this.http.put<any>(`${this.actualizar}/${id}`, almacenes);
  }

  deleteAlmacenes(id: number): Observable<any> {
    return this.http.delete<any>(`${this.eliminar}/${id}`);
  }
}
