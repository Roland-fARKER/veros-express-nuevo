import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Proveedor } from 'src/app/Models/proveedor.model';
import { ProveedoresService } from 'src/app/Services/proveedores.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-proveedores',
  templateUrl: './proveedores.component.html',
  styleUrls: ['./proveedores.component.css'],
  providers: [MessageService, ConfirmationService],
})
export class ProveedoresComponent implements OnInit {
  proveedorForm: FormGroup;
  proveedores: any[] = [];
  selectedProveedor: any = {};
  displayDialog: boolean = false;

  constructor(
    private fb: FormBuilder,
    private proveedoresService: ProveedoresService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {
    this.proveedorForm = this.fb.group({
      Nombre_Proveedor: ['', [Validators.required]],
      Estado: [false, [Validators.required]],
      Num_Telefono: [null, [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.loadProveedores();
  }

  loadProveedores(): void {
    this.proveedoresService.getAllProveedores().subscribe((data) => {
      this.proveedores = data;
    });
  }

  showDialogToAdd(): void {
    this.selectedProveedor = {
      Nombre_Proveedor: '',
      Estado: true,
      Num_Telefono: null,
    };
    this.proveedorForm.reset();
    this.displayDialog = true;
  }

  editProveedor(proveedor: any): void {
    this.selectedProveedor = { ...proveedor };
    this.displayDialog = true;
  }

  saveProveedor(): void {
    if (this.proveedorForm.valid) {
      const controls = this.proveedorForm.controls;
  
      const proveedor: Proveedor = {
        Nombre_Proveedor: controls['Nombre_Proveedor']?.value,
        Estado: controls['Estado']?.value,
        Num_Telefono: controls['Num_Telefono']?.value,
      };
  
      const isNew = !this.selectedProveedor.id_Proveedor;
  
      this.proveedoresService[isNew ? 'addProveedor' : 'updateProveedor'](
        isNew ? null : this.selectedProveedor.id_Proveedor,
        proveedor
      ).subscribe(
        (data) => {
          this.loadProveedores();
          this.displayDialog = false;
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: isNew ? 'Proveedor agregado' : 'Proveedor actualizado',
          });
        },
        (error) => {
          console.error(error);
          console.error(error.error);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error al guardar el proveedor',
          });
        }
      );
    }
  }

  deleteProveedor(id: number): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este proveedor?',
      accept: () => {
        this.proveedoresService.deleteProveedor(id).subscribe(
          (data) => {
            this.loadProveedores();
            this.displayDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Proveedor eliminado',
            });
          },
          (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el proveedor',
            });
          }
        );
      },
    });
  }

  closeDialog(): void {
    this.displayDialog = false;
  }
}
