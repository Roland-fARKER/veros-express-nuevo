import { Component, OnInit } from '@angular/core';
import { FamiliaService } from 'src/app/Services/famila.service';
import { ConfirmationService, MessageService } from 'primeng/api';

export interface Familia {
  id: number;
  Nombre_familia: string;
}

@Component({
  selector: 'app-familias',
  templateUrl: './familias.component.html',
  styleUrls: ['./familias.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class FamiliasComponent implements OnInit {
  // Propiedades del componente
  familia: Familia[] = []; // Lista de categorias
  newFamilia: Familia = { id: 0, Nombre_familia: '' }; // Nuevo almacén a agregar
  editingRows: { [key: number]: boolean } = {}; // Filas en estado de edición
  showAddFormFlag = false; // Bandera para mostrar/ocultar el formulario de agregar
  filteredFamilia: Familia[] = []; // Lista de almacenes filtrada
  searchText: string = ''; // Texto de búsqueda

  // Constructor del componente, inyección de servicios necesarios
  constructor(
    private familiaService: FamiliaService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  // Método llamado al inicializar el componente
  ngOnInit(): void {
    this.loadFamilias(); // Cargar la lista de almacenes al iniciar
  }

  // Método para cargar la lista de almacenes desde el servicio
  loadFamilias(): void {
    this.familiaService.getAllFamilias().subscribe((familia) => {
      this.familia = familia; // Asignar la lista completa
      this.applyFilter(); // Aplicar filtro de búsqueda si es necesario
    });
  }

  // Método para agregar un nuevo almacén
  addFamilia
  (): void {
    this.familiaService.addFamilia(this.newFamilia.Nombre_familia).subscribe(
      () => {
        this.loadFamilias(); // Recargar la lista después de agregar
        this.newFamilia.Nombre_familia = ''; // Reiniciar el nombre del nuevo almacén
        this.showAddFormFlag = false; // Ocultar el formulario de agregar
        // Mensaje de éxito al usuario
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Familia agregada correctamente.',
        });
      },
      (error) => {
        console.error('Error al agregar familia:', error);
        // Mensaje de error al usuario
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al agregar familia. Consulta la consola para más detalles.',
        });
      }
    );
  }

  // Método para cancelar la adición de un nuevo almacén
  cancelAdd(): void {
    this.showAddFormFlag = false; // Ocultar el formulario de agregar
    this.newFamilia.Nombre_familia = ''; // Reiniciar el nombre del nuevo almacén
  }

  // Método para verificar si una fila está en estado de edición
  isRowEditing(rowIndex: number): boolean {
    return this.editingRows[rowIndex];
  }

  // Método para iniciar la edición de una fila
  editRow(rowIndex: number): void {
    Object.keys(this.editingRows).forEach(
      (key: any) => (this.editingRows[key] = false)
    );
    this.editingRows[rowIndex] = true;
    this.newFamilia = { ...this.familia[rowIndex] };
  }

  // Método para guardar los cambios después de editar una fila
  saveRow(familia: Familia, rowIndex: number): void {
    this.editingRows[rowIndex] = false; // Marcar la fila como no editada
    const Nombre_familiaToUpdate = { Nombre_familia: familia.Nombre_familia };
    // Llamar al servicio para actualizar el almacén en el servidor
    this.familiaService
      .updateFamilia(familia.id, Nombre_familiaToUpdate)
      .subscribe(
        () => {
          this.loadFamilias(); // Recargar la lista después de la actualización
          // Mensaje de éxito al usuario
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Familia actualizada correctamente.',
          });
        },
        (error) => {
          console.error('Error al actualizar familia:', error);
          // Mensaje de error al usuario
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error al actualizar familia Consulta la consola para más detalles.',
          });
        }
      );
  }

  // Método para cancelar la edición de una fila
  cancelRow(rowIndex: number): void {
    this.editingRows[rowIndex] = false; // Marcar la fila como no editada
  }

  // Método para eliminar un almacén con confirmación del usuario
  deleteFamilia(id: number): void {
    this.confirmationService.confirm({
      header: 'Confirma para eliminar',
      message: '¿Estás seguro de que deseas eliminar esta familia?',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.familiaService.deleteFamilia(id).subscribe(() => {
          this.loadFamilias(); // Recargar la lista después de la eliminación
          // Mensaje de éxito al usuario
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoria eliminada correctamente.',
          });
        });
      },
    });
  }

  // Método para mostrar el formulario de agregar un nuevo almacén
  showAddForm(): void {
    this.showAddFormFlag = true;
  }

  // Método para aplicar el filtro de búsqueda
  applyFilter(): void {
    this.filteredFamilia = this.filterData(this.searchText);
  }

  // Método privado para filtrar los almacenes según el texto de búsqueda
  private filterData(filterText: string): Familia[] {
    return this.familia.filter((familia) =>
      familia.Nombre_familia.toLowerCase().includes(filterText.toLowerCase())
    );
  }
}


  
  

  