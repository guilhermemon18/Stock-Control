import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './modules/home/home.component';
import { DashboardHomeComponent } from './modules/dashboard/page/dashboard-home/dashboard-home.component';
import { AuthGuard } from './guards/auth-guard.service';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'dashboard',
    pathMatch: 'full',
  },
  {
    path: 'home',
    component: HomeComponent,
  },
  {
    path: 'dashboard',
    //lazy loading: rotas carregadas sob demanda, para evitar quedas de desempenho e atrasos no carregamento da aplicação web.
    loadChildren: () => import('./modules/dashboard/dashboard.module').then(
      (m) => m.DashboardModule
    ),
    //guarda de rotas, impede de acessar a rota usando o AuthGuard criado, validando o acesso.
    canActivate: [AuthGuard]
  },

  {
    path: 'products',
    loadChildren: () => import('./modules/products/products.module').then(
      (m) => m.ProductsModule
    ),
    canActivate: [AuthGuard],
  },
  {
    path: 'categories',
    loadChildren: () => import("./modules/categories/categories.module").then(
      (m) => m.CategoriesModule
    ),
    canActivate: [AuthGuard],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
