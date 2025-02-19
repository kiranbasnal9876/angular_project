import { Component, inject, Injectable, input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';

import { ApiService } from '../../api.service';

export  interface dataformate{

  table:[],
  total_records:number,
  page_no:number
  
  }
  

@Component({
  selector: 'app-paggination',
  imports: [],
  templateUrl: './paggination.component.html',
  styleUrl: './paggination.component.css'
})

@Injectable({
  providedIn:'root'
})
export class PagginationComponent implements OnInit,dataformate  {

    table: [] = [];
    total_records: number = 0;
    page_no: number = 1;
  
    ngOnInit(): void{
      this.getdata();
    }
  
  
  constructor(private user:ApiService ){

        }
    records: any[] = [];

  formdata = input<FormGroup>() ;
  
  

  getdata(){

    // console.log(this.formdata()?.value);
    this.user.postApicall("/paggination/test",this.formdata()?.value).subscribe((response: any) =>{
      console.log(response);
     this.records = response.table;
     this.page_no=response.page_no;
     this.total_records=response.total_records;
   }
   )
   
   }

   

  getRows(row:any){
  this.formdata()?.controls['row_no'].setValue(row);
this.getdata();
   
  }


  left(){
   if(this.page_no > 1){
     this.formdata()?.controls['page_no'].setValue(this.page_no-1);
     this.getdata();
     console.log("left");
   }
  }

  right(){

    if(this.total_records > this.page_no){
      this.formdata()?.controls['page_no'].setValue(this.page_no+1);
      this.getdata();
      console.log("right");

    }

  }

}
