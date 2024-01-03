import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { ConfirmationService } from 'primeng/api';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  providers: [ConfirmationService]
})
export class DashboardComponent {
  constructor(
    private authService :AuthenticationService,
    private _confirmationservice : ConfirmationService
  ){}



  cerrar(){
    this._confirmationservice.confirm({
      header: "confirmar cerrar sesión",
      message: "¿Está seguro de cerrar sesión?",
      icon: 'pi pi-sign-out',
      acceptLabel: 'Confirmar',
      rejectLabel: 'Cancelar',
      acceptIcon:"pi pi-check",
            rejectIcon:"pi pi-times",
      accept: ()=>{
        this.authService.LogOut();
      }
    });
  }
}
