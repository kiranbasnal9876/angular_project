import { Routes } from '@angular/router';
import { DashboardComponent } from './MyComponent/dashboard/dashboard.component';
import { LogInComponent } from './MyComponent/log-in/log-in.component';
import { UsermasterComponent } from './MyComponent/usermaster/usermaster.component';
import { ClientmasterComponent } from './MyComponent/clientmaster/clientmaster.component';
import { ItemmasterComponent } from './MyComponent/itemmaster/itemmaster.component';
import { InvoicemasterComponent } from './MyComponent/invoicemaster/invoicemaster.component';

export const routes: Routes = [
    {
        path: '',
         redirectTo: '/log-in', 
         pathMatch: 'full'
     },
     {
        path:'log-in',
        component:LogInComponent
     },
    {
        path:'dashboard',
        component:DashboardComponent,
        children:[{
            path:'usermaster',
            title:'User Master',
            component:UsermasterComponent
         },
         {
            path:'clientmaster', 
            title:'Client Master',
            component:ClientmasterComponent
         },
         {
            path:'itemmaster',
            title:'Item Master',
            component:ItemmasterComponent
         },
         {
            path:'invoicemaster',
            title:'Invoice Master',
            component:InvoicemasterComponent
         }]
    },
     
];
