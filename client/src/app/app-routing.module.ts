import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetSexhaComponent } from './components/reset-sexha/reset-sexha.component';
import { HomeComponent } from './components/home/home.component';
import { CadastroProdutorComponent } from './components/cadastro-produtor/cadastro-produtor.component';
import { WhoAreComponent } from './components/who-are/who-are.component';
import { ListaUsersComponent } from './components/admin/lista-users/lista-users.component';
import { ListFarmersComponent } from './components/admin/list-farmers/list-farmers.component';
import { HomeAdminComponent } from './components/admin/home-admin/home-admin.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: RegisterComponent },
  { path: 'resetSenha', component: ResetSexhaComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'cadastroagricultor', component: CadastroProdutorComponent },
  { path: 'quemsomos', component: WhoAreComponent },
  { path: 'listusers', component: ListaUsersComponent },
  { path: 'listfarmers', component: ListFarmersComponent },
  { path: 'admin', component: HomeAdminComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
