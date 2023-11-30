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
      nombre: ['', [Validators.required]],
      estado: [false, [Validators.required]],
      telefono: [null, [Validators.required]],
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
      nombre: '',
      estado: true,
      telefono: null,
    };
    this.proveedorForm.reset();
    this.displayDialog = true;
  }

  editProveedor(proveedor: any): void {
    this.selectedProveedor = { ...proveedor };

    // Asigna los valores del proveedor al formulario
    this.proveedorForm.setValue({
      nombre: this.selectedProveedor.nombre,
      estado: this.selectedProveedor.estado,
      telefono: this.selectedProveedor.telefono,
    });

    this.displayDialog = true;
  }

  save(): void {
    const isNew = !this.selectedProveedor.id;
    const operation = isNew ? 'addProveedor' : 'updateProveedor';
  
    this.proveedoresService[operation](isNew ? null : this.selectedProveedor.id, this.selectedProveedor)
      .subscribe(
        () => this.handleSuccess(isNew),
        (error) => this.handleError(error)
      );
  }
  
  private handleSuccess(isNew: boolean): void {
    this.loadProveedores();
    this.displayDialog = false;
    const message = isNew ? 'Proveedor agregado' : 'Proveedor actualizado';
    this.showMessage('success', 'Éxito', message);
  }
  
  private handleError(error: any): void {
    console.error(error);
    this.showMessage('error', 'Error', 'Error al guardar el proveedor');
  }
  
  private showMessage(severity: string, summary: string, detail: string): void {
    this.messageService.add({ severity, summary, detail });
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
