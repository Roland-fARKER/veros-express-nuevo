import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ButtonModule } from 'primeng/button';

//componentes
import { LoginComponent } from './View/Account/login/login.component';
import { DashboardComponent } from './View/dashboard/dashboard.component';
import { CrearUsuariosComponent } from './View/Account/crear-usuarios/crear-usuarios.component';
import { FamiliasComponent } from './View/Account/familias/familias.component';
import { ProveedoresComponent } from './View/Account/proveedores/proveedores.component';
import { CategoriasComponent } from './View/Account/categorias/categorias.component';
import { AlmacenesComponent } from './View/Account/almacenes/almacenes.component';
import { ProductosComponent } from './View/Account/productos/productos.component';
import { CatalogoComponent } from './View/Account/catalogo/catalogo.component';
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
    canActivate: [AuthenticationGuard],
    children: [
      {
        path: 'RegistrarUsuarios',
        component: CrearUsuariosComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'Familias',
        component: FamiliasComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'Proveedores',
        component: ProveedoresComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'Productos',
        component: ProductosComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'Categorias',
        component: CategoriasComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'Almacenes',
        component: AlmacenesComponent,
        canActivate: [AuthenticationGuard],
      },
      {
        path: 'Catalogo',
        component: CatalogoComponent,
        canActivate: [AuthenticationGuard],
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
export class AppRoutingModule { }
