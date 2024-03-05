// productos.component.ts
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FormControl, FormGroup } from '@angular/forms';
import { ProductosService } from 'src/app/Services/productos.service';
import { CategoriasService } from 'src/app/Services/categorias.service';
import { FamiliaService } from 'src/app/Services/famila.service';
import { ProveedorService } from 'src/app/Services/proveedores.service';

export interface Productos {
  id_producto: number;
  Nombre_Producto: string;
  Descripcion: string;
  Precio_Compra: number | undefined;
  Precio_venta: number | undefined;
  Id_Categoria: number;
  Id_Familia: number;
  Id_Proveedor: number;
}

export interface Categorias {
  id_categoria: number;
  Nombre_Categoria: string;
}

export interface Familia {
  id: number;
  Nombre_familia: string;
}

export interface Proveedor {
  id: number;
  nombre: string;
  estado: boolean;
  telefono: number;
}

@Component({
  selector: 'app-productos',
  templateUrl: './productos.component.html',
  styleUrls: ['./productos.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ProductosComponent implements OnInit {
  productos: Productos[] = [];
  newProductos: Productos = {
    id_producto: 0,
    Nombre_Producto: '',
    Descripcion: '',
    Precio_Compra: undefined,
    Precio_venta: undefined,
    Id_Categoria: 0,
    Id_Familia: 0,
    Id_Proveedor: 0,
  };
  editingRows: { [key: number]: boolean } = {};
  showAddFormFlag = false;
  filteredProductos: Productos[] = [];
  searchText: string = '';

  categorias: Categorias[] = [];
  categoriaselect: Categorias | undefined;
  familia: Familia[] = [];
  familiaSelect: Familia | undefined;
  proveedores: Proveedor[] = [];
  proveedorSelect: Proveedor | undefined;

  constructor(
    private productosService: ProductosService,
    private categoriasService: CategoriasService,
    private familiaService: FamiliaService,
    private proveedorService: ProveedorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProductos();
    this.loadCategorias();
    this.loadFamilias();
    this.loadProveedores();
  }

  loadCategorias(): void {
    this.categoriasService.getAllCategorias().subscribe((categorias) => {
      this.categorias = categorias; // Asignar la lista completa
      console.log(categorias);
    });
  }

  loadFamilias(): void {
    this.familiaService.getAllFamilias().subscribe((familia) => {
      this.familia = familia; // Asignar la lista completa
      console.log(familia);
    });
  }

  loadProveedores(): void {
    this.proveedorService.getAllProveedores().subscribe((proveedores) => {
      this.proveedores = proveedores;
      console.log(proveedores);
    });
  }

  loadProductos(): void {
    this.productosService.getAllProductos().subscribe((productos) => {
      this.productos = productos;
      this.applyFilter();
      console.log(productos);
    });
  }

  addProductos(): void {
    // Obtener los valores seleccionados de los dropdowns
    const categoriaId = this.categoriaselect?.id_categoria;
    const familiaId = this.familiaSelect?.id;
    const proveedorId = this.proveedorSelect?.id;

    // Asignar los valores al objeto newProductos
    this.newProductos.Id_Categoria =
      categoriaId !== undefined ? categoriaId : 0;
    this.newProductos.Id_Familia = familiaId !== undefined ? familiaId : 0;
    this.newProductos.Id_Proveedor =
      proveedorId !== undefined ? proveedorId : 0;

    // Llamar al servicio para agregar productos
    this.productosService.addProductos(this.newProductos).subscribe(
      () => {
        this.loadProductos();
        this.resetForm();
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
    this.resetForm();
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
    this.productosService
      .updateProductos(productos.id_producto, productos)
      .subscribe(
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

  mapearCategoria(id:number) {
    const categoria = this.categorias.find(categoria => categoria.id_categoria === id)
    if (categoria) {
      return categoria?.Nombre_Categoria;
    } else {
      return "NA";
    }
  }

  mapearFamilia(id:number) {
    const familia = this.familia.find(familia => familia.id === id)
    if (familia) {
      return familia.Nombre_familia;
    } else {
      return "NA";
    }
  }

  mapearProveedor(id:number) {
    const proveedor = this.proveedores.find(proveedor => proveedor.id === id)
    if (proveedor) {
      return proveedor.nombre;
    } else {
      return "NA";
    }
  }

  resetForm() {
    this.newProductos = {
      id_producto: 0,
      Nombre_Producto: '',
      Descripcion: '',
      Precio_Compra: undefined,
      Precio_venta: undefined,
      Id_Categoria: 0,
      Id_Familia: 0, 
      Id_Proveedor: 0, 
    };
  }
}
