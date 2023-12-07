import { Component, OnInit } from '@angular/core';
import { AlmacenesService } from 'src/app/Services/almacenes.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AlmacenesComponent implements OnInit {

  almacenes: any[] = [];
  selectedAlmacenes: any = {};
  displayDialog: boolean = false;

  constructor(
    private almacenService: AlmacenesService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadAlmacenes();
  }

  loadAlmacenes(): void {
    this.almacenService.getAllAlmacenes().subscribe((data) => {
      this.almacenes = data;
    });
  }

  showDialogToAdd(): void {
    this.selectedAlmacenes = {};
    this.displayDialog = true;
  }

  save(): void {
    const isNew = !this.selectedAlmacenes.id;

    this.almacenService[isNew ? 'addAlmacenes' : 'updateAlmacenes'](
      isNew ? this.selectedAlmacenes : this.selectedAlmacenes.id,
      this.selectedAlmacenes
    ).subscribe(
      (data) => {
        this.loadAlmacenes();
        this.displayDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: isNew ? 'Almacén agregado' : 'Almacén actualizado',
        });
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar el almacén',
        });
      }
    );
  }

  delete(almacenes: any): void {
    this.selectedAlmacenes = { ...almacenes };
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar este almacén?',
      accept: () => {
        this.almacenService.deleteAlmacenes(this.selectedAlmacenes.id).subscribe(
          () => {
            this.loadAlmacenes();
            this.displayDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Almacén eliminado',
            });
          },
          (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar el almacén',
            });
          }
        );
      },
    });
  }

  onRowSelect(event: any): void {
    if (event && event.data) {
      this.selectedAlmacenes = { ...event.data };
      this.displayDialog = true;
    } else {
      console.error(
        'Error al seleccionar la fila. Datos de evento no válidos.'
      );
    }
  }
}
