import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-sidebar',
  imports: [RouterOutlet,RouterLink,RouterLinkActive],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css'
})
export class SidebarComponent {
  constructor(private router: Router ,private api:ApiService) {
    this.get_menu();
  }
  log_out(){
   
    localStorage.clear();
    
  }

  total_menu:any=[];

get_menu(){
  this.api.postApicall('Dashboard/Menu','').subscribe((responce:any)=>{
this.total_menu=responce.data;
  })

}


}
