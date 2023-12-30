// Importación de módulos y servicios necesarios
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlmaceneService } from 'src/app/Services/almacenes.service';

// Definición de la interfaz Almacene
interface Almacene {
  id: number;
  nombre: string;
}

// Decorador del componente Angular
@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.css'],
  providers: [ConfirmationService, MessageService],
})
// Clase del componente
export class AlmacenesComponent implements OnInit {
  // Propiedades del componente
  almacenes: Almacene[] = []; // Lista de almacenes
  newAlmacene: Almacene = { id: 0, nombre: '' }; // Nuevo almacén a agregar
  editingRows: { [key: number]: boolean } = {}; // Filas en estado de edición
  showAddFormFlag = false; // Bandera para mostrar/ocultar el formulario de agregar
  filteredAlmacenes: Almacene[] = []; // Lista de almacenes filtrada
  searchText: string = ''; // Texto de búsqueda

  // Constructor del componente, inyección de servicios necesarios
  constructor(
    private almaceneService: AlmaceneService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  // Método llamado al inicializar el componente
  ngOnInit(): void {
    this.loadAlmacenes(); // Cargar la lista de almacenes al iniciar
  }

  // Método para cargar la lista de almacenes desde el servicio
  loadAlmacenes(): void {
    this.almaceneService.getAllAlmacenes().subscribe((almacenes) => {
      this.almacenes = almacenes; // Asignar la lista completa
      this.applyFilter(); // Aplicar filtro de búsqueda si es necesario
    });
  }

  // Método para agregar un nuevo almacén
  addAlmacene(): void {
    this.almaceneService.addAlmacene(this.newAlmacene.nombre).subscribe(
      () => {
        this.loadAlmacenes(); // Recargar la lista después de agregar
        this.newAlmacene.nombre = ''; // Reiniciar el nombre del nuevo almacén
        this.showAddFormFlag = false; // Ocultar el formulario de agregar
        // Mensaje de éxito al usuario
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Almacén agregado correctamente.',
        });
      },
      (error) => {
        console.error('Error al agregar almacén:', error);
        // Mensaje de error al usuario
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al agregar almacén. Consulta la consola para más detalles.',
        });
      }
    );
  }

  // Método para cancelar la adición de un nuevo almacén
  cancelAdd(): void {
    this.showAddFormFlag = false; // Ocultar el formulario de agregar
    this.newAlmacene.nombre = ''; // Reiniciar el nombre del nuevo almacén
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
    this.newAlmacene = { ...this.almacenes[rowIndex] };
  }

  // Método para guardar los cambios después de editar una fila
  saveRow(almacene: Almacene, rowIndex: number): void {
    this.editingRows[rowIndex] = false; // Marcar la fila como no editada
    const nombreToUpdate = { nombre: almacene.nombre };
    // Llamar al servicio para actualizar el almacén en el servidor
    this.almaceneService
      .updateAlmacene(almacene.id, nombreToUpdate)
      .subscribe(
        () => {
          this.loadAlmacenes(); // Recargar la lista después de la actualización
          // Mensaje de éxito al usuario
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Almacén actualizado correctamente.',
          });
        },
        (error) => {
          console.error('Error al actualizar almacén:', error);
          // Mensaje de error al usuario
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error al actualizar almacén. Consulta la consola para más detalles.',
          });
        }
      );
  }

  // Método para cancelar la edición de una fila
  cancelRow(rowIndex: number): void {
    this.editingRows[rowIndex] = false; // Marcar la fila como no editada
  }

  // Método para eliminar un almacén con confirmación del usuario
  deleteAlmacene(id: number): void {
    this.confirmationService.confirm({
      header: 'Confirma para eliminar',
      message: '¿Estás seguro de que deseas eliminar este almacén?',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.almaceneService.deleteAlmacene(id).subscribe(() => {
          this.loadAlmacenes(); // Recargar la lista después de la eliminación
          // Mensaje de éxito al usuario
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Almacén eliminado correctamente.',
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
    this.filteredAlmacenes = this.filterData(this.searchText);
  }

  // Método privado para filtrar los almacenes según el texto de búsqueda
  private filterData(filterText: string): Almacene[] {
    return this.almacenes.filter((almacene) =>
      almacene.nombre.toLowerCase().includes(filterText.toLowerCase())
    );
  }
}
