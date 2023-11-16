import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

//Componentes
import { Ilustracion1Component } from './ilustracion1/ilustracion1.component';

@NgModule({
  declarations: [
    Ilustracion1Component
  ],
  imports: [
    CommonModule
  ],
  exports:[
    Ilustracion1Component,
  ]
})
export class SharedModule { }
