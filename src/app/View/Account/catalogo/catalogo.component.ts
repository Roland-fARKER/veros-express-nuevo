import { Component } from '@angular/core';
import { AlmaceneService } from 'src/app/Services/almacenes.service';

interface Almacene {
  id: number;
  nombre: string;
}


@Component({
  selector: 'app-catalogo',
  templateUrl: './catalogo.component.html',
  styleUrls: ['./catalogo.component.css']
})
export class CatalogoComponent {
  almacenes: Almacene[] = [];

  constructor( private almacenesSer: AlmaceneService ) { }

  ngOnInit(): void {
    this.obtenerAlmacenes();
  }

  obtenerAlmacenes(){
    this.almacenesSer.getAllAlmacenes().subscribe((almacenes) => {
      this.almacenes = almacenes; // Asignar la lista completa
      console.log(almacenes);
    });
  }

}
