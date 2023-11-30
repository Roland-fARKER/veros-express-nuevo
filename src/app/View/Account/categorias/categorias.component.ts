import { Component, OnInit } from '@angular/core';
import { CategoriasService } from 'src/app/Services/categorias.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class CategoriasComponent implements OnInit {

  categorias: any[] = [];
  selectedCategorias: any = {};
  displayDialog: boolean = false;

  constructor(
    private categoriasService: CategoriasService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.loadCategorias();
  }

  loadCategorias(): void {
    this.categoriasService.getAllCategorias().subscribe((data) => {
      this.categorias = data;
    });
  }

  showDialogToAdd(): void {
    this.selectedCategorias = {};
    this.displayDialog = true;
  }

  save(): void {
    const isNew = !this.selectedCategorias.id;

    this.categoriasService[isNew ? 'addCategorias' : 'updateCategorias'](
      isNew ? this.selectedCategorias : this.selectedCategorias.id,
      this.selectedCategorias
    ).subscribe(
      (data) => {
        this.loadCategorias();
        this.displayDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: isNew ? 'Categorias agregada' : 'Categorias actualizada',
        });
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar la categorias',
        });
      }
    );
  }

  delete(categorias: any): void {
    this.selectedCategorias = { ...categorias};
    console.log(this.selectedCategorias),
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar esta categoria?',
      accept: () => {
        this.categoriasService.deleteCategorias(this.selectedCategorias.id).subscribe(
          (data) => {
            this.loadCategorias();
            this.displayDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Categorias eliminada',
            });
          },
          (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la categorias',
            });
          }
        );
      },
    });
  }

  onRowSelect(event: any): void {
    if (event && event.data) {
    this.selectedCategorias = { ...event.data };
    this.displayDialog = true;
  } else {
    console.error(
      'Error al seleccionar la fila. Datos de evento no válidos.'
    );
  }
  }
}
