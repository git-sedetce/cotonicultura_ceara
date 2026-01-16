import { NgModule } from '@angular/core';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './components/estrutura/header/header.component';
import { FooterComponent } from './components/estrutura/footer/footer.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { ResetSexhaComponent } from './components/reset-sexha/reset-sexha.component';
import { ListaUserComponent } from './components/lista-user/lista-user.component';
import { ToastrModule } from 'ngx-toastr';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HomeComponent } from './components/home/home.component';
import { CadastroProdutorComponent } from './components/cadastro-produtor/cadastro-produtor.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { NgxMaskModule } from 'ngx-mask';
import { DatePipe } from '@angular/common';
import { AuthInterceptor } from './services/interceptor/auth.interceptor';
import { ListaUsersComponent } from './components/admin/lista-users/lista-users.component';
import { ListFarmersComponent } from './components/admin/list-farmers/list-farmers.component';
import { WhoAreComponent } from './components/who-are/who-are.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    LoginComponent,
    RegisterComponent,
    ResetSexhaComponent,
    ListaUserComponent,
    HomeComponent,
    CadastroProdutorComponent,
    ListaUsersComponent,
    ListFarmersComponent,
    WhoAreComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    ToastrModule.forRoot(),
    NgxMaskModule.forRoot(),
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule
  ],
  providers: [
    provideClientHydration(),
    DatePipe,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
