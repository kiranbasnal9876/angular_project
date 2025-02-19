import { Component, inject, Injectable, OnInit,ViewChild, ElementRef } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationComponent } from '../validation/validation.component';
import { HttpClient } from '@angular/common/http';

import { ApiService } from '../../api.service';
import { PagginationComponent } from '../paggination/paggination.component';

// export  interface dataformate{

//   table:[],
//   total_records:number,
//   page_no:number
  
//   }
  

@Component({
  selector: 'app-usermaster',
  imports: [FormsModule, ReactiveFormsModule, ValidationComponent,PagginationComponent],
  templateUrl: './usermaster.component.html',
  styleUrl: './usermaster.component.css'
})




export class UsermasterComponent  {
  @ViewChild('homeTab') homeTab: ElementRef | undefined;
  // formdata: FormGroup;

user_all_fun = inject(PagginationComponent);
  constructor(private http: HttpClient,private user:ApiService ) {

   
  }

  formdata = new FormGroup({
    name: new FormControl(),
    phone: new FormControl(),
    email: new FormControl(),

    colname: new FormControl(),
    order: new FormControl(),
    page_no: new FormControl(1),
    row_no: new FormControl(4),
    table_name: new FormControl('user_master'),

  })

  reset(){
   
    this.formdata.controls['name'].reset();
    this.formdata.controls['phone'].reset();
    this.formdata.controls['email'].reset();

    this.user_all_fun.getdata();
    
     }

     search(){
      console.log(this.formdata.value);
      this.user_all_fun.getdata();
     }




  userdata = new FormGroup({
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,30}$/)]),
    table_name: new FormControl('user_master'),
    action: new FormControl('insert'),
  })



  submit() {

    if (this.userdata.valid) {
      this.user.postApicall("/crud_operations/insert",this.userdata.value).subscribe((response: any) => {
       
        if(response.status==200){

          // alert("insert successfully");
          // const editBtn = document.querySelector("#nav-home-tab");
          if (this.homeTab) {
            // Bootstrap Tab method
            const tab = new bootstrap.Tab(this.homeTab.nativeElement);
            tab.show();
          }
          this.userdata.reset();
        }
      })
    
    }
    else {
      this.userdata.markAllAsTouched();
    }
  }



}
