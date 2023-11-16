import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../Environments/invironments';
import { MessageService } from 'primeng/api';
import { catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { RegisterModel } from '../Models/register.model';

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private nestJsUrl = environment.backendUrl;

  //contructor de la clase HttpClient y messageservice
  constructor(
    private http: HttpClient,
    private messageService: MessageService
  ) {}

  // Método para realizar una solicitud POST al endpoint 'register'
  registerUser(registerDto: RegisterModel): Observable<any> {
    return this.http.post<any>(`${this.nestJsUrl}/auth/register`, registerDto);
  }

  login(username: string, password: string) {
    //peticion post para inicio de sesion
    return this.http
      .post<any>(`${this.nestJsUrl}/auth/login`, {
        userName: username,
        password: password,
      })
      .pipe(
        catchError((error) => {
          if (error.status === 401) {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: error.error.message,
            });
          } else {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Ocurrió un error inesperado',
            });
          }
          return throwError(error);
        })
      );
  }

  public RemoveToken(): void {
    localStorage.removeItem(environment.tokenKey);
  }

  public LogOut(): void {
    this.RemoveToken();
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem('token');
  }
}
