import { Component, OnInit } from '@angular/core';
import { FamiliaService } from 'src/app/Services/famila.service';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
  selector: 'app-familias',
  templateUrl: './familias.component.html',
  styleUrls: ['./familias.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class FamiliasComponent implements OnInit {
  familias: any[] = [];
  selectedFamilia: any = {};
  displayDialog: boolean = false;

  constructor(
    private familiaService: FamiliaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    this.loadFamilias();
  }

  loadFamilias(): void {
    this.familiaService.getAllFamilias().subscribe((data) => {
      this.familias = data;
    });
  }

  showDialogToAdd(): void {
    this.selectedFamilia = {};
    this.displayDialog = true;
  }

  save(): void {
    const isNew = !this.selectedFamilia.id;

    this.familiaService[isNew ? 'addFamilia' : 'updateFamilia'](
      isNew ? this.selectedFamilia : this.selectedFamilia.id,
      this.selectedFamilia
    ).subscribe(
      (data) => {
        this.loadFamilias();
        this.displayDialog = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: isNew ? 'Familia agregada' : 'Familia actualizada',
        });
      },
      (error) => {
        console.error(error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Error al guardar la familia',
        });
      }
    );
  }

  delete(): void {
    this.confirmationService.confirm({
      message: '¿Estás seguro de que quieres eliminar esta familia?',
      accept: () => {
        this.familiaService.deleteFamilia(this.selectedFamilia.id).subscribe(
          (data) => {
            this.loadFamilias();
            this.displayDialog = false;
            this.messageService.add({
              severity: 'success',
              summary: 'Éxito',
              detail: 'Familia eliminada',
            });
          },
          (error) => {
            console.error(error);
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Error al eliminar la familia',
            });
          }
        );
      },
    });
  }

  onRowSelect(event: any): void {
    this.selectedFamilia = { ...event.data };
    this.displayDialog = true;
  }
}
