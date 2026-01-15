import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetSexhaComponent } from './components/reset-sexha/reset-sexha.component';
import { HomeComponent } from './components/home/home.component';
import { CadastroProdutorComponent } from './components/cadastro-produtor/cadastro-produtor.component';

const routes: Routes = [

  { path: 'login', component: LoginComponent },
  { path: 'cadastro', component: RegisterComponent },
  { path: 'resetsenha', component: ResetSexhaComponent },
  { path: 'home', component: HomeComponent },
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'cadastroagricultor', component: CadastroProdutorComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
