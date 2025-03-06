
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class checkViewgaurd implements CanActivate {

  constructor(private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const storedMenu = localStorage.getItem('menu'); 
    // console.log(state.url , 'state url');
    // console.log(this.router.url , 'router url');
    const menuArray: any = storedMenu

    // console.log('Allowed Routes:', menuArray);
    // Extract route after "/dashboard/"
    const currentRoute: string = state.url.split('/')[2]; 
    if (menuArray.includes(currentRoute)) {
      return true; 
    } else {
      this.router.navigate(['/restricted']); 
      return false;
    }
  }
}
