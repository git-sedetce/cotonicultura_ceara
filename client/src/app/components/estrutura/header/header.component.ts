import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: false,
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent implements OnInit {
  authenticated: boolean = false;
  user_name: string = '';
  profile: number = 0;
  sexec_id: number = 0;

  private sub!: Subscription;

  constructor() { }

  ngOnInit(): void {
    // Initialization logic here
  }

  logout(){

  }

}
