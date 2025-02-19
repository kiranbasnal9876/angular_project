import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LogInComponent } from './MyComponent/log-in/log-in.component';
import { DashboardComponent } from "./MyComponent/dashboard/dashboard.component";


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LogInComponent, RouterOutlet, DashboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'first_Project';
}
