import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ButtonModule } from 'primeng/button';

//componentes
import { LoginComponent } from './View/Account/login/login.component';
import { DashboardComponent } from './View/dashboard/dashboard.component';
import { CrearUsuariosComponent } from './View/Account/crear-usuarios/crear-usuarios.component';
import { FamiliasComponent } from './View/Account/familias/familias.component';

//Guards
import { AuthenticationGuard } from './Guards/authentication.guard';

const routes: Routes = [
  {
    path: 'Account/Login',
    component: LoginComponent,
  },

  {
    path: 'Dashboard',
    component: DashboardComponent,
    //canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'RegistrarUsuarios',
        component: CrearUsuariosComponent,
        //canActivate: [AuthenticationGuard],
      },
      {
        path: 'Familias',
        component: FamiliasComponent,
      }
    ],
  },
  {
    path: '',
    redirectTo: 'Dashboard',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes), ButtonModule],
  exports: [RouterModule, ButtonModule],
})
export class AppRoutingModule {}
