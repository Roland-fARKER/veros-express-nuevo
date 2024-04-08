import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CatalogoService } from 'src/app/Services/catalogo.service';
import { ProductosService } from 'src/app/Services/productos.service';
import { AlmaceneService } from 'src/app/Services/almacenes.service';

export interface Catalogo {
  id_catalogo: number;
  Stock: number | undefined;
  Id_Producto: number;
  Id_Almacen: number;
}

export interface Productos {
  id_producto: number;
  Nombre_Producto: string;
}

interface Almacene {
  id: number;
  nombre: string;
}


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class CatalogoComponent implements OnInit {
  catalogo: Catalogo [] = [];
  newCatalogo: Catalogo = { id_catalogo: 0, Stock: undefined, Id_Producto: 0, Id_Almacen: 0, };
  editingRows: { [key: number]: boolean } = {};
  showAddFormFlag = false;
  filteredCatalogo: Catalogo[] = [];
  searchText: string = '';

  productos: Productos[] = [];
  productosselect: Productos | undefined;
  almacenes: Almacene[] = [];
  almacenesselect: Almacene | undefined;

  constructor( 
  private catalogoService: CatalogoService,
  private productosService: ProductosService,
  private almacenesSer: AlmaceneService,
  private confirmationService: ConfirmationService,
  private messageService: MessageService
  ) {}
    // this.resetForm();

  ngOnInit(): void {
    this.loadCatalogo();
    this.loadProductos();
    this.obtenerAlmacenes();
  }

  obtenerAlmacenes(): void {
    this.almacenesSer.getAllAlmacenes().subscribe((almacenes) => {
      this.almacenes = almacenes;
      console.log(almacenes);
    });
  }

  loadCatalogo(): void {
    this.catalogoService.getAllCatalogo().subscribe((catalogo) => {
      this.catalogo = catalogo;
      this.applyFilter();
      console.log(catalogo);
    });
  }

  loadProductos(): void {
    this.productosService.getAllProductos().subscribe((productos) => {
      this.productos = productos;
      console.log(productos);
    });
  }

  addCatalogo(): void {
    const productoId = this.productosselect?.id_producto;
    const almacenesId = this.almacenesselect?.id;
   
    this.newCatalogo.Id_Producto =
      productoId !== undefined ? productoId : 0;
    this.newCatalogo.Id_Almacen = almacenesId !== undefined ? almacenesId : 0;

    this.catalogoService.addCatalogo(this.newCatalogo).subscribe(
      () => {
        this.loadCatalogo();
        this.resetForm();
        this.showAddFormFlag = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Catalogo agregado correctamente.',
        });
      },
      (error) => {
        console.error('Error al agregar catalogo:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al agregar catalogo. Consulta la consola para más detalles.',
        });
      }
    );
  }

  cancelAdd(): void {
    this.showAddFormFlag = false;
    this.resetForm();
  }
  
  saveRow(catalogo: Catalogo, rowIndex: number): void {
    this.catalogoService
    this.loadCatalogo();
  }

  deleteCatalogo(id_catalogo: number): void {
    this.confirmationService.confirm({
      header: 'Confirma para eliminar',
      message: '¿Estás seguro de que deseas eliminar este catalogo?',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.catalogoService.deleteCatalogo(id_catalogo).subscribe(() => {
          this.loadCatalogo();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Catalogo eliminado correctamente.',
          });
        });
      },
    });
  }

  showAddForm(): void {
    this.showAddFormFlag = true;
  }

  applyFilter(): void {
    this.filteredCatalogo = this.filterData(this.searchText);
  }
  

  private filterData(filterText: string): Catalogo[] {
    return this.catalogo.filter((catalogo) =>
      catalogo.Id_Almacen.toString().includes(filterText)
    );
  }
  


  mapearProductos(id:number) {
    const producto = this.productos.find(producto => producto.id_producto === id)
    if (producto) {
      return producto?.Nombre_Producto;
    } else {
      return "NA";
    }
  }

  mapearAlmacene(id:number) {
    const almacenes = this.almacenes.find(almacenes => almacenes.id === id)
    if (almacenes) {
      return almacenes?.nombre;
    } else {
      return "NA";
    }
  }


  resetForm() {
    this.newCatalogo = {
      id_catalogo: 0,
      Stock: undefined,
      Id_Producto: 0,
      Id_Almacen: 0,
    };
  }

}
