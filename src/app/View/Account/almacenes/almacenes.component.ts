import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AlmaceneService } from 'src/app/Services/almacenes.service';

interface Almacene {
  id: number;
  nombre: string;
}
@Component({
  selector: 'app-almacenes',
  templateUrl: './almacenes.component.html',
  styleUrls: ['./almacenes.component.css'],
  providers: [ConfirmationService, MessageService],
})
export class AlmacenesComponent implements OnInit {
  //lista donde se almacenan losdatos de los almacenes existentes
  almacenes: Almacene[] = [];
  //objeto para guardar temporalmente los datos de un nuevo almacen
  newAlmacene: Almacene = { id: 0, nombre: '' };
  //bandera para saber si esl estado esta en editar o no
  editingRows: { [key: number]: boolean } = {};
  //bandera para mpstrar el formulario de un nuevo almacen
  showAddFormFlag = false;

  constructor(
    private almaceneService: AlmaceneService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService
  ) {}

  ngOnInit(): void {
    //ngOnInit es una funcion que se ejecuta al iniciar el llamado al componente
    this.loadAlmacenes();
  }

  loadAlmacenes(): void {
    //esta funcion consume el servicio de almacenes y usa el metodo getAll
    //para traer todos los almacenes y los guarda en el array almacenes
    this.almaceneService.getAllAlmacenes().subscribe((almacenes) => {
      this.almacenes = almacenes;
    });
  }

  addAlmacene(): void {
    //se encarga de enviar los datos del nuevo almacen a el servicio
    this.almaceneService.addAlmacene(this.newAlmacene.nombre).subscribe(
      () => {
        //si todo va bien
        //vuelve a cargar todos los almacenes
        this.loadAlmacenes();
        //reinicia la proiedad nombre del arreglo temporar
        this.newAlmacene.nombre = '';
        //cierra la bandera de agregar
        this.showAddFormFlag = false;
        //envia la notificaión al usuario
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Almacén agregado correctamente.',
        });
      },
      (error) => {
        //si hay errores
        //manda el error a la consola
        console.error('Error al agregar almacén:', error);
        //manda notificación al usuario
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al agregar almacén. Consulta la consola para más detalles.',
        });
      }
    );
  }

  cancelAdd(): void {
    //se encarga de cerrar el formulario de agregar un almacen nuevo
    this.showAddFormFlag = false;
    // reiniciar lapropiedad nombre del arreglo temporal
    this.newAlmacene.nombre = '';
  }

  isRowEditing(rowIndex: number): boolean {
    //agrega los campos de edicion segun la fila seleccionada
    return this.editingRows[rowIndex];
  }

  // Esta función se llama cuando se hace clic en el botón de edición de una fila
  editRow(rowIndex: number): void {
    // Se asegura de que todas las filas estén marcadas como no editadas
    Object.keys(this.editingRows).forEach(
      (key: any) => (this.editingRows[key] = false)
    );
    // La fila específica se marca como editada
    this.editingRows[rowIndex] = true;
    // Se actualiza newAlmacene con una copia del almacén correspondiente a la fila que se está editando
    this.newAlmacene = { ...this.almacenes[rowIndex] };
  }

  // Esta función se llama cuando se hace clic en el botón de guardado después de editar una fila
  saveRow(almacene: Almacene, rowIndex: number): void {
    // Se marca la fila como no editada
    this.editingRows[rowIndex] = false;
    // Se crea un objeto con la propiedad 'nombre' del almacén para enviar al servicio de actualización
    const nombreToUpdate = { nombre: almacene.nombre };
    // Se llama al servicio para actualizar el almacén en el servidor
    this.almaceneService.updateAlmacene(almacene.id, nombreToUpdate).subscribe(
      () => {
        // Si la actualización es exitosa, se recarga la lista de almacenes
        this.loadAlmacenes();
        // Se muestra un mensaje de éxito al usuario
        this.messageService.add({
          severity: 'success',
          summary: 'Éxito',
          detail: 'Almacén actualizado correctamente.',
        });
      },
      (error) => {
        // En caso de error, se muestra un mensaje de error en la consola y en la interfaz de usuario
        console.error('Error al actualizar almacén:', error);
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail:
            'Error al actualizar almacén. Consulta la consola para más detalles.',
        });
      }
    );
  }

  cancelRow(rowIndex: number): void {
    this.editingRows[rowIndex] = false;
  }

  deleteAlmacene(id: number): void {
    this.confirmationService.confirm({
      header: 'Confirma para eliminar',
      message: '¿Estás seguro de que deseas eliminar este almacén?',
      icon: 'pi pi-trash',
      acceptLabel: 'Eliminar',
      rejectLabel: 'Cancelar',
      accept: () => {
        this.almaceneService.deleteAlmacene(id).subscribe(() => {
          this.loadAlmacenes();
          this.messageService.add({
            severity: 'success',
            summary: 'Éxito',
            detail: 'Almacén eliminado correctamente.',
          });
        });
      },
    });
  }

  showAddForm(): void {
    this.showAddFormFlag = true;
  }
}
