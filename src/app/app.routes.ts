import { Routes } from '@angular/router';
import { DashboardComponent } from './MyComponent/dashboard/dashboard.component';
import { LogInComponent } from './MyComponent/log-in/log-in.component';
import { UsermasterComponent } from './MyComponent/usermaster/usermaster.component';
import { ClientmasterComponent } from './MyComponent/clientmaster/clientmaster.component';
import { ItemmasterComponent } from './MyComponent/itemmaster/itemmaster.component';
import { InvoicemasterComponent } from './MyComponent/invoicemaster/invoicemaster.component';
import { HomeComponent } from './MyComponent/home/home.component';
import { checkLogUserGuard } from './check-log-user.guard';
import { AuthGuard } from './auth-guard.guard';
import { UserpermissionComponent } from './MyComponent/userpermission/userpermission.component';
import { RestrictedComponent } from './MyComponent/restricted/restricted.component';
import { checkViewgaurd } from './check-view.guard';
// import { checkViewgaurd } from './check-view.guard';
export const routes: Routes = [
    {
        path: '',
         redirectTo: '/log-in', 
         pathMatch: 'full'
     },
     {
        path:'log-in',
        component:LogInComponent,
        canActivate: [AuthGuard],
     
        
     },
    {
        path:'dashboard',
        component:DashboardComponent,
         canActivate: [checkLogUserGuard],
        
        children:[
         {
            path:'usermaster',
            title:'User Master',
            component:UsermasterComponent,
            canActivate:[checkViewgaurd]
           
         },
         {
            path:'home',
            title:'',
            component:HomeComponent,
            canActivate:[checkViewgaurd]
         },
         {
            path:'clientmaster', 
            title:'Client Master',
            component:ClientmasterComponent,
            canActivate:[checkViewgaurd]
         },
         {
            path:'itemmaster',
            title:'Item Master',
            component:ItemmasterComponent,
            canActivate:[checkViewgaurd]
         },
         {
            path:'invoicemaster',
            title:'Invoice Master',
            component:InvoicemasterComponent,
            canActivate:[checkViewgaurd]
         },
         {
            path:'userpermission',
            title:'User Permission',
            component:UserpermissionComponent,
            canActivate:[checkViewgaurd]
         },
       
      ]
    },
    {

      path:'restricted',
      title:'Not Allowed',
      component:RestrictedComponent
    }
   
     
];
