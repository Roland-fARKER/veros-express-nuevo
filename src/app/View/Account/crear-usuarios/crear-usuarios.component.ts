import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from 'src/app/Services/authentication.service';
import { MessageService } from 'primeng/api';
import { RegisterModel } from 'src/app/Models/register.model';

@Component({
  selector: 'app-crear-usuarios',
  templateUrl: './crear-usuarios.component.html',
  styleUrls: ['./crear-usuarios.component.css'],
})
export class CrearUsuariosComponent {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private _auth:AuthenticationService, private messageService: MessageService) {
    this.registerForm = this.fb.group({
      userName: ['', [Validators.required, Validators.minLength(4)]],
      name: ['', [Validators.required]],
      admin: [false, [Validators.required]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      const userName = this.registerForm.get('userName');
      const name = this.registerForm.get('name');
      const admin = this.registerForm.get('admin');
      const password = this.registerForm.get('password');

      if (userName && name && admin && password && userName.valid && name.valid && admin.valid && password.valid) {
        const registerDto: RegisterModel = {
          userName: userName.value,
          name: name.value,
          admin: admin.value,
          password: password.value,
        };

        this._auth.registerUser(registerDto).subscribe(
          (response) => {
            console.log('Usuario registrado con éxito', response);
            this.registerForm.reset();
            this.showSuccessMessage();
          },
          (error) => {
            console.error('Error al registrar usuario', error);
          }
        );
      }
    }
  }

  private showSuccessMessage() {
    this.messageService.add({
      severity: 'success',
      summary: 'Registro exitoso',
      detail: 'El usuario se ha registrado correctamente.',
    });
  }
}
