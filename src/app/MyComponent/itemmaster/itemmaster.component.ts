
import { Component, inject, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationComponent } from '../validation/validation.component';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../api.service';


import { PagginationComponent } from '../paggination/paggination.component';

import { NgClass, NgIf } from '@angular/common';
import Swal from 'sweetalert2';

export interface dataformate {

  table: [],
  total_records: number,
  page_no: number

}


@Injectable({
  providedIn: 'root'
})


@Component({
  selector: 'app-itemmaster',
  imports: [FormsModule, ReactiveFormsModule, ValidationComponent, PagginationComponent, NgIf, NgClass],
  templateUrl: './itemmaster.component.html',
  styleUrl: './itemmaster.component.css'
})
export class ItemmasterComponent implements OnInit, dataformate {



  table: [] = [];
  total_records: number = 0;
  page_no: number = 1;

  records: any[] = [];
  formdata: FormGroup;
  Data: any;

  ngOnInit(): void {
    this.getdata();
    this.permission_data();
  }
   Upload_Folder:string ='http://localhost/Angular_Project/api/Item_images/';

  
  constructor( public api: ApiService) {
    this.formdata = new FormGroup({
      itemName: new FormControl(),
      colname: new FormControl("id"),
      order: new FormControl("DESc"),
      page_no: new FormControl(1),
      row_no: new FormControl(4),
    })
  }


  isSubmitVisible: boolean = true;
  isUpdateVisible: boolean = false;
  add_permission: boolean = true;
  delete_permission:boolean=true;
  update_permission:boolean=true;

  itemdata = new FormGroup({
    id: new FormControl(),
    itemName: new FormControl('', Validators.required),
    itemD: new FormControl('', Validators.required),
    itemPrice: new FormControl('', [Validators.required,Validators.maxLength(20)]),
    itemPath: new FormControl('', Validators.required),
   
  })


  getdata() {
    this.api.postApicall("item_master/get_item_data", this.formdata.value).subscribe((response: any) => {
      this.records = response.data.table;
      this.page_no = response.data.page_no;
      this.total_records = response.data.total_page;     
    }
    )

  }

  convertTobool(val:any){
    if(val==1){
      return true;
    }
    else{
      return false;
    }
    }

    permission_data(){
      this.api.postApicall("item_master/get_permission",'').subscribe((response:any)=>{
       const permission = response.data;
       this.add_permission =this.convertTobool(permission[0].add_records);  
       this.delete_permission=this.convertTobool(permission[0].delete_records);
       this.update_permission=this.convertTobool(permission[0].update_records); 
        })
      }
  reset() {
    this.formdata.controls['itemName'].reset();

    this.getdata();

  }

  search() {
    this.formdata.controls['page_no'].setValue(1)
    this.getdata();
  }



  activeTab: any = 'search';


  searchtab(activeTab: any) {
    this.activeTab = activeTab;
    this.itemdata.reset();
    this.isSubmitVisible = true;;
    this.isUpdateVisible = false;
  }

  result(activeTab: any) {

    this.activeTab = activeTab;

    this.isSubmitVisible = true;;
    this.isUpdateVisible = false;

  }



  // Insert data functions 

  file: File | null = null;
  fileBase64: string | null = null;
  imageUrl: any;
  imageDiv: boolean = true;

  onChange(event: any) {
    const file: File = event.target.files[0];
    let reader = new FileReader();
    if (file) {
      this.file = file;
     
      this.imageUrl = this.file
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      this.imageDiv = false;
    }
    else {
      this.imageDiv = true;
      reader.onload = () => {
        this.imageUrl = "";
      };
    }
  }

  clearImage() {
    this.itemdata.controls['itemPath']?.setValue('');
    this.imageUrl = '';
    this.imageDiv = true;
  }


 

  submit_Update(action: string) {
    let formdata = new FormData();
    Object.entries(this.itemdata.value).forEach(([key, value]) => {
       formdata.append(key, value);
    });
    if (this.file) {
      formdata.set('itemPath', this.file);
  }
    if (action == 'insert') {

      if (this.itemdata.valid) {
        this.api.postApicall("item_master/insert_item_data", formdata).subscribe((response: any) => {

          if (response.status == 200) {

            this.itemdata.reset();
            Swal.fire({
              title: "Data inserted  successfully!",
              icon: "success",
              draggable: true
            });
            this.itemdata.reset();
            this.imageDiv = true;
            this.searchtab('search');
            this.getdata();


          }
        })

      }
      else {
        this.itemdata.markAllAsTouched();
      }
    }
    else {

      this.api.postApicall("item_master/update_item_data", formdata).subscribe((response: any) => {

        if (response==1){
          Swal.fire({
            title: "Updated successfully!",
            icon: "success",
            draggable: true
          });
          this.searchtab('search');
          this.itemdata.reset();
          this.getdata();
          this.clearImage();
        }
      })
    }

  }



  edit_delete(id: number, action: string) {
  
  
          if (action == "edit") {
  
            this.api.postApicall("item_master/edit_item_data", id).subscribe(
              (response: any) => {
               
          
          this.imageDiv = false;
          let editValue = response.data[0];
          if(editValue['itemPath']){
               
            this.imageUrl=this.Upload_Folder+editValue['itemPath'];
          }
          delete editValue.itemPath;

          Object.entries(editValue).forEach(([key, value]) => {
            if (this.itemdata.get(key)) {

              this.itemdata.get(key)?.setValue(value);
             
            }
            
          })
            this.result('result');
           
            this.isSubmitVisible = false;
            this.isUpdateVisible = true;
          
        },
        (error) => {
          alert('not a valid call');
        }
      );
          }
          else {
  
          
            Swal.fire({
              title: "Are you sure?",
              text: "You won't be able to revert this!",
              icon: "warning",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, delete it!"
            }).then((result) => {
              if (result.isConfirmed) {
                this.api.postApicall("item_master/delete_item_data", id).subscribe(
                  (response: any) => {
                   
                    if (response.status ==200) {
                      Swal.fire({
                        title: "deleted successfully!",
                        icon: "success",
                        draggable: true,
      
                      });
                      this.getdata();
      
                    }
                    else{
                      Swal.fire({
                        title: "data not deleted!",
                        icon: "warning",
                        draggable: true,
      
                      });
  
                    }
                  },
                  (error) => {
                    alert('not a valid call');
                  }
                );
               
  
              }
            });
  
  
          }
      
  
    }
  


  sort(name: string) {

    if (this.formdata.controls['order'].value == "DESC") {
      this.formdata.controls['order'].setValue("ASC");
    }
    else {
      this.formdata.controls['order'].setValue("DESC");
    }
    this.formdata.controls['colname'].setValue(name);
    this.getdata();

  }
}
