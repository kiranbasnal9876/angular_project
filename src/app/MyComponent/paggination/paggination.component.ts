import { Component, inject, Injectable,  input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

// import { ApiService } from '../../api.service';
import { UsermasterComponent } from '../usermaster/usermaster.component';
// import { ItemmasterComponent } from '../itemmaster/itemmaster.component';


@Component({
  selector: 'app-paggination',
  imports: [],
  templateUrl: './paggination.component.html',
  styleUrl: './paggination.component.css'
})


export class PagginationComponent {

user_all_fun = inject(UsermasterComponent);
// item_all_fun = inject(ItemmasterComponent);

// @Input() tablename : any;
  constructor(){

        }
    

  formdata = input<FormGroup>() ;


  
  
  getRows(row:any){
    this.formdata()?.controls['row_no'].setValue(row);
    this.formdata()?.controls['page_no'].setValue(1);
  
    this.user_all_fun.getdata()

    
//  this.item_all_fun.getdata();
    console.log("itemmaster");
      
   
  }


  left(){
   if(this.user_all_fun.page_no > 1){
     this.formdata()?.controls['page_no'].setValue(this.user_all_fun.page_no-1);
     this.user_all_fun.getdata();
    //  this.item_all_fun.getdata();
     
   }
  }

  right(){

    if(this.user_all_fun.total_records > this.user_all_fun.page_no){
      this.formdata()?.controls['page_no'].setValue(this.user_all_fun.page_no+1);
      this.user_all_fun.getdata();
      
      

    }

  }

}
