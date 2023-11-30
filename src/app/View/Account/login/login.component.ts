import { Component } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';

//servicios
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { LoaderService } from 'src/app/Services/loader.service';

//primeNG
import { MessageService } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  providers: [
    AuthenticationService,
    MessageService,
    // ... otros proveedores
  ],
})
export class LoginComponent {
  loginForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private auth: AuthenticationService,
    private router: Router,
    private messageService: MessageService,
    private loaderService: LoaderService
  ) {
    this.loginForm = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onLogin() {
    if (this.loginForm.valid) {
      const { userName, password } = this.loginForm.value;

      this.loaderService.show(); // Mostrar el loader antes del inicio de sesión

      this.auth.login(userName, password).subscribe(
        (data: any) => {
          this.loaderService.hide(); // Ocultar el loader después de la autenticación
          
          localStorage.setItem('token', data.token);
          console.log('Usuario autenticado:', data.userName);

          // Redirigir a la ruta 'dashboard' después de una autenticación exitosa
          this.router.navigate(['/Dashboard/Familias']);
        },
        (error) => {

          this.loaderService.hide(); // Ocultar el loader en caso de error

          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Credenciales incorrectas' });
          console.error('Error en la autenticación:', error);
        }
      );
    }
  }
}
