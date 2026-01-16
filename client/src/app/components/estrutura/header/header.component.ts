import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { CadastroService } from '../../../services/cadastro.service';

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

  constructor(
    private serviceUser: CadastroService
  ) { }

  ngOnInit(): void {
    if (typeof window === 'undefined') return;

    this.updateUserInfo(this.serviceUser.getUser());

    this.sub = this.serviceUser.user$.subscribe(user => {
      this.updateUserInfo(user);
    });
  }

  ngOnDestroy() {
    if (this.sub) this.sub.unsubscribe();
  }

  updateUserInfo(user: any) {
    if (!user) {
      this.authenticated = false;
      this.user_name = '';
      this.profile = 0;
      this.sexec_id = 0;
      return;
    }

    this.authenticated = true;
    this.user_name = user._user_name;
    this.profile = Number(user._profile_id);
    this.sexec_id = Number(user._sexec_id);
  }

  logout(){
    this.serviceUser.logout()
  }

}
