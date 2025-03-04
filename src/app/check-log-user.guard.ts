

import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class checkLogUserGuard implements CanActivate {

  constructor(private router: Router) {}

  canActivate(): boolean {
    if (localStorage.getItem('token')) {
      return true; // Allow access
    }
    this.router.navigate(['/log-in']); 
    return false;
  }
}

