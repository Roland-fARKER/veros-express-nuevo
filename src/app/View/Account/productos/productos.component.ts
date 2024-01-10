// productos.component.ts
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProductosService } from 'src/app/Services/productos.service';

export interface Productos {
  id_producto: number;
  Nombre_Producto: string;
  Descripcion: string;
  Stock: number;
  Precio_Compra: number;
  Precio_venta: number;
  Precio_Unitario: number;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ProductosComponent implements OnInit {
  productos: Productos[] = [];
  newProductos: Productos = { id_producto: 0, Nombre_Producto: '', Descripcion: '', Stock: 0, Precio_Compra: 0, Precio_venta: 0, Precio_Unitario: 0 };
  editingRows: { [key: number]: boolean } = {};
  showAddFormFlag = false;
  filteredProductos: Productos[] = [];
  searchText: string = '';

  constructor(
    private productosService: ProductosService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProductos();
  }

  loadProductos(): void {
    this.productosService.getAllProductos().subscribe((productos) => {
      this.productos = productos;
      this.applyFilter();
    });
  }

  addProductos(): void {
    this.productosService.addProductos(this.newProductos).subscribe(
      () => {
        this.loadProductos();
        this.newProductos = { id_producto: 0, Nombre_Producto: '', Descripcion: '', Stock: 0, Precio_Compra: 0, Precio_venta: 0, Precio_Unitario: 0 };
        this.showAddFormFlag = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Productos agregado correctamente.',
        });
      },
      (error) => {
        console.error('Error al agregar productos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al agregar productos. Consulta la consola para más detalles.',
        });
      }
    );
  }

  cancelAdd(): void {
    this.showAddFormFlag = false;
    this.newProductos = { id_producto: 0, Nombre_Producto: '', Descripcion: '', Stock: 0, Precio_Compra: 0, Precio_venta: 0, Precio_Unitario: 0 };
  }

  isRowEditing(rowIndex: number): boolean {
    return this.editingRows[rowIndex];
  }

  editRow(rowIndex: number): void {
    Object.keys(this.editingRows).forEach(
      (key: any) => (this.editingRows[key] = false)
    );
    this.editingRows[rowIndex] = true;
    this.newProductos = { ...this.productos[rowIndex] };
  }

  saveRow(productos: Productos, rowIndex: number): void {
    this.editingRows[rowIndex] = false;
    this.productosService.updateProductos(productos.id_producto, productos).subscribe(
      () => {
        this.loadProductos();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Productos actualizado correctamente.',
        });
      },
      (error) => {
        console.error('Error al actualizar productos:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al actualizar productos. Consulta la consola para más detalles.',
        });
      }
    );
  }

  cancelRow(rowIndex: number): void {
    this.editingRows[rowIndex] = false;
  }

  deleteProductos(id_producto: number): void {
    this.confirmationService.confirm({
      header: 'Confirma para eliminar',
      message: '¿Estás seguro de que deseas eliminar este producto?',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.productosService.deleteProductos(id_producto).subscribe(() => {
          this.loadProductos();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Productos eliminado correctamente.',
          });
        });
      },
    });
  }

  showAddForm(): void {
    this.showAddFormFlag = true;
  }

  applyFilter(): void {
    this.filteredProductos = this.filterData(this.searchText);
  }

  private filterData(filterText: string): Productos[] {
    return this.productos.filter((producto) =>
      producto.Nombre_Producto.toLowerCase().includes(filterText.toLowerCase())
    );
  }
}

