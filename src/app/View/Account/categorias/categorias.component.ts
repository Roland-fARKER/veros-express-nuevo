// Importación de módulos y servicios necesarios
import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CategoriasService } from 'src/app/Services/categorias.service';

// Definición de la interfaz Categorias
export interface Categorias {
  id_categoria: number;
  Nombre_Categoria: string;
}

// Decorador del componente Angular
@Component({
  selector: 'app-categorias',
  templateUrl: './categorias.component.html',
  styleUrls: ['./categorias.component.css'],
  providers: [ConfirmationService, MessageService],
})
// Clase del componente
export class CategoriasComponent implements OnInit {
  // Propiedades del componente
  categorias: Categorias[] = []; // Lista de categorias
  newCategorias: Categorias = { id_categoria: 0, Nombre_Categoria: '' }; // Nuevo almacén a agregar
  editingRows: { [key: number]: boolean } = {}; // Filas en estado de edición
  showAddFormFlag = false; // Bandera para mostrar/ocultar el formulario de agregar
  filteredCategorias: Categorias[] = []; // Lista de almacenes filtrada
  searchText: string = ''; // Texto de búsqueda

  // Constructor del componente, inyección de servicios necesarios
  constructor(
    private categoriasService: CategoriasService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  // Método llamado al inicializar el componente
  ngOnInit(): void {
    this.loadCategorias(); // Cargar la lista de almacenes al iniciar
  }

  // Método para cargar la lista de almacenes desde el servicio
  loadCategorias(): void {
    this.categoriasService.getAllCategorias().subscribe((categorias) => {
      this.categorias = categorias; // Asignar la lista completa
      this.applyFilter(); // Aplicar filtro de búsqueda si es necesario
    });
  }

  // Método para agregar un nuevo almacén
  addCategorias
  (): void {
    this.categoriasService.addCategorias(this.newCategorias.Nombre_Categoria).subscribe(
      () => {
        this.loadCategorias(); // Recargar la lista después de agregar
        this.newCategorias.Nombre_Categoria = ''; // Reiniciar el nombre del nuevo almacén
        this.showAddFormFlag = false; // Ocultar el formulario de agregar
        // Mensaje de éxito al usuario
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Categoria agregada correctamente.',
        });
      },
      (error) => {
        console.error('Error al agregar categoria:', error);
        // Mensaje de error al usuario
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al agregar categoria. Consulta la consola para más detalles.',
        });
      }
    );
  }

  // Método para cancelar la adición de un nuevo almacén
  cancelAdd(): void {
    this.showAddFormFlag = false; // Ocultar el formulario de agregar
    this.newCategorias.Nombre_Categoria = ''; // Reiniciar el nombre del nuevo almacén
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
    this.newCategorias = { ...this.categorias[rowIndex] };
  }

  // Método para guardar los cambios después de editar una fila
  saveRow(categorias: Categorias, rowIndex: number): void {
    this.editingRows[rowIndex] = false; // Marcar la fila como no editada
    const Nombre_CategoriaToUpdate = { Nombre_Categoria: categorias.Nombre_Categoria };
    // Llamar al servicio para actualizar el almacén en el servidor
    this.categoriasService
      .updateCategorias(categorias.id_categoria, Nombre_CategoriaToUpdate)
      .subscribe(
        () => {
          this.loadCategorias(); // Recargar la lista después de la actualización
          // Mensaje de éxito al usuario
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Categoria actualizada correctamente.',
          });
        },
        (error) => {
          console.error('Error al actualizar categoria:', error);
          // Mensaje de error al usuario
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail:
              'Error al actualizar categoria Consulta la consola para más detalles.',
          });
        }
      );
  }

  // Método para cancelar la edición de una fila
  cancelRow(rowIndex: number): void {
    this.editingRows[rowIndex] = false; // Marcar la fila como no editada
  }

  // Método para eliminar un almacén con confirmación del usuario
  deleteCategorias(id: number): void {
    this.confirmationService.confirm({
      header: 'Confirma para eliminar',
      message: '¿Estás seguro de que deseas eliminar esta categoria?',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.categoriasService.deleteCategorias(id).subscribe(() => {
          this.loadCategorias(); // Recargar la lista después de la eliminación
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
    this.filteredCategorias = this.filterData(this.searchText);
  }

  // Método privado para filtrar los almacenes según el texto de búsqueda
  private filterData(filterText: string): Categorias[] {
    return this.categorias.filter((categoria) =>
      categoria.Nombre_Categoria.toLowerCase().includes(filterText.toLowerCase())
    );
  }
}

