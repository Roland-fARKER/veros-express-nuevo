// producto.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Productos {
  id_producto: number;
  Nombre_Producto: string;
  Descripcion: string;
  Stock: number;
  Precio_Compra: number;
  Precio_venta: number;
  Precio_Unitario: number;
}

@Injectable({
  providedIn: 'root',
})
export class ProductosService {
  private apiUrl = 'http://localhost:3000/verosApi/v1/productos';

  constructor(private http: HttpClient) {}

  getAllProductos(): Observable<Productos[]> {
    return this.http.get<Productos[]>(this.apiUrl + '/Obtener');
  }

  addProductos(productos: Productos): Observable<Productos> {
    // Elimina el ID antes de enviar la solicitud al backend
    const { id_producto, ...productosWithoutId } = productos;
  
    // Convertir el campo "Stock" a tipo number
    productosWithoutId.Stock = Number(productosWithoutId.Stock);

    // Convertir el campo "Precio_Compra" a tipo number
    productosWithoutId.Precio_Compra = Number(productosWithoutId.Precio_Compra);

    // Convertir el campo "Precio_venta" a tipo number
    productosWithoutId.Precio_venta = Number(productosWithoutId.Precio_venta);

    // Convertir el campo "Precio_Unitario" a tipo number
    productosWithoutId.Precio_Unitario = Number(productosWithoutId.Precio_Unitario);

  
    // Agrega la palabra "Agregar" a la URL
    const apiUrlWithAction = `${this.apiUrl}/Enviar`;
    console.log(productosWithoutId);
    return this.http.post<Productos>(apiUrlWithAction, productosWithoutId);
  }
  
  updateProductos(id_producto: number, productos: Productos): Observable<Productos> {
    const { id_producto: productosId, ...productosWithoutId } = productos;

    productosWithoutId.Stock = Number(productosWithoutId.Stock);
    productosWithoutId.Precio_Compra = Number(productosWithoutId.Precio_Compra);
    productosWithoutId.Precio_venta = Number(productosWithoutId.Precio_venta);
    productosWithoutId.Precio_Unitario = Number(productosWithoutId.Precio_Unitario);
    const url = `${this.apiUrl}/actualizar/${id_producto}`;
    console.log(productosWithoutId);
    return this.http.patch<Productos>(url, productosWithoutId);
  }

  deleteProductos(id_producto: number): Observable<void> {
    const url = `${this.apiUrl}/Delete/${id_producto}`;
    return this.http.delete<void>(url);
  }
}

