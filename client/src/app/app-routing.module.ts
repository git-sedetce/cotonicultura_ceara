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
import { AnexoComponent } from './components/anexo/anexo.component';
import { ListFarmesDropoutsComponent } from './components/admin/list-farmes-dropouts/list-farmes-dropouts.component';
import { DuvidasComponent } from './components/duvidas/duvidas.component';
import { AuditoriaComponent } from './components/admin/auditoria/auditoria.component';
import { authGuard } from './services/auth/auth.guard';
import { PerfilProdutorComponent } from './components/cadastro-produtor/perfil-produtor/perfil-produtor.component';
import { FirstLoginComponent } from './components/first-login/first-login.component';
import { ResetSenhaProdutorComponent } from './components/reset-senha-produtor/reset-senha-produtor.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: RegisterComponent },
  {
    path: 'perfil',
    component: PerfilProdutorComponent,
    canActivate: [authGuard],
    data: { userTypes: ['producer'] },
  },
  { path: 'resetSenha', component: ResetSexhaComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'cadastroagricultor', component: CadastroProdutorComponent },
  { path: 'firstlogin', component: FirstLoginComponent },
  { path: 'resetSenhaProdutor', component: ResetSenhaProdutorComponent },
  { path: 'quemsomos', component: WhoAreComponent },
  { path: 'listusers', component: ListaUsersComponent, canActivate: [authGuard], data: { roles: [1] } },
  { path: 'listfarmers', component: ListFarmersComponent, canActivate: [authGuard], data: { roles: [1, 2, 3, 4, 5] } },
  { path: 'admin', component: HomeAdminComponent, canActivate: [authGuard], data: { roles: [1, 2, 3, 4, 5] } },
  { path: 'anexo', component: AnexoComponent, canActivate: [authGuard], data: { roles: [1, 2, 3, 4, 5] } },
  { path: 'desistentes', component: ListFarmesDropoutsComponent, canActivate: [authGuard], data: { roles: [1, 2, 3, 4, 5] } },
  {
    path: 'auditoria',
    component: AuditoriaComponent,
    canActivate: [authGuard],
    data: { roles: [1, 2, 3] },
  },
  // { path: 'whats', component: WhoAreComponent},
  { path: 'questions', component: DuvidasComponent},

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
