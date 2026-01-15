import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { LoginUser } from '../../models/login-user.model';

@Component({
  selector: 'app-login',
  standalone: false,
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  @ViewChild("formLogin") formLogin!: NgForm;
  loginUsers!: LoginUser;

  constructor() { }

  ngOnInit(): void {
    this.loginUsers = new LoginUser()
  }

  verificaEmail(email: any){
    console.log(email);
  }

  login(){

  }

}
