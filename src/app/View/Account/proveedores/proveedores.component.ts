// proveedores.component.ts

import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ProveedorService } from 'src/app/Services/proveedores.service';

interface Proveedor {
  id: number;
  nombre: string;
  estado: boolean;
  telefono: number;
}

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class ProveedoresComponent implements OnInit {
  proveedores: Proveedor[] = [];
  newProveedor: Proveedor = { id: 0, nombre: '', estado: false, telefono: 0 };
  editingRows: { [key: number]: boolean } = {};
  showAddFormFlag = false;
  filteredProveedores: Proveedor[] = [];
  searchText: string = '';

  constructor(
    private proveedorService: ProveedorService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.proveedorService.getAllProveedores().subscribe((proveedores) => {
      this.proveedores = proveedores;
      this.applyFilter();
    });
  }

  addProveedor(): void {
    this.proveedorService.addProveedor(this.newProveedor).subscribe(
      () => {
        this.loadProveedores();
        this.newProveedor = { id: 0, nombre: '', estado: false, telefono: 0 };
        this.showAddFormFlag = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Proveedor agregado correctamente.',
        });
      },
      (error) => {
        console.error('Error al agregar proveedor:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al agregar proveedor. Consulta la consola para más detalles.',
        });
      }
    );
  }

  cancelAdd(): void {
    this.showAddFormFlag = false;
    this.newProveedor = { id: 0, nombre: '', estado: false, telefono: 0 };
  }

  isRowEditing(rowIndex: number): boolean {
    return this.editingRows[rowIndex];
  }

  editRow(rowIndex: number): void {
    Object.keys(this.editingRows).forEach(
      (key: any) => (this.editingRows[key] = false)
    );
    this.editingRows[rowIndex] = true;
    this.newProveedor = { ...this.proveedores[rowIndex] };
  }

  saveRow(proveedor: Proveedor, rowIndex: number): void {
    this.editingRows[rowIndex] = false;
    this.proveedorService.updateProveedor(proveedor.id, proveedor).subscribe(
      () => {
        this.loadProveedores();
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Proveedor actualizado correctamente.',
        });
      },
      (error) => {
        console.error('Error al actualizar proveedor:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al actualizar proveedor. Consulta la consola para más detalles.',
        });
      }
    );
  }

  cancelRow(rowIndex: number): void {
    this.editingRows[rowIndex] = false;
  }

  deleteProveedor(id: number): void {
    this.confirmationService.confirm({
      header: 'Confirma para eliminar',
      message: '¿Estás seguro de que deseas eliminar este proveedor?',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.proveedorService.deleteProveedor(id).subscribe(() => {
          this.loadProveedores();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Proveedor eliminado correctamente.',
          });
        });
      },
    });
  }

  showAddForm(): void {
    this.showAddFormFlag = true;
  }

  applyFilter(): void {
    this.filteredProveedores = this.filterData(this.searchText);
  }

  private filterData(filterText: string): Proveedor[] {
    return this.proveedores.filter((proveedor) =>
      proveedor.nombre.toLowerCase().includes(filterText.toLowerCase())
    );
  }
}
