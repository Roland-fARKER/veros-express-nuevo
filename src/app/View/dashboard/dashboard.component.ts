import { Component } from '@angular/core';
import { AuthenticationService } from 'src/app/Services/authentication.service';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  constructor(
    private authService :AuthenticationService,
  ){}



  cerrar(){
    this.authService.LogOut();
  }
}
