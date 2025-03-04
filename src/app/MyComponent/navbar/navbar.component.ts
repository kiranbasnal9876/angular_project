import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  log_user:any;
  constructor(public api: ApiService) {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      this.log_user = api.getTokenData(storedToken);
    } else {
      this.log_user = null; 
    }
  }
}
