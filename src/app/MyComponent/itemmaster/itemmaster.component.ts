
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
export class ItemmasterComponent  implements OnInit, dataformate{


  
    table: [] = [];
    total_records: number = 0;
    page_no: number = 1;
  
    records: any[] = [];
    formdata: FormGroup;
  
    ngOnInit(): void {
      this.getdata();
    }
  
  
    constructor(private http: HttpClient, private user: ApiService) {
  
  
      this.formdata = new FormGroup({
        itemName: new FormControl(),
      
  
        colname: new FormControl("id"),
        order: new FormControl("DESc"),
        page_no: new FormControl(1),
        row_no: new FormControl(4),
        table_name: new FormControl('item_master'),
  
      })
    }
  
  
    isSubmitVisible: boolean = true;
    isUpdateVisible: boolean = false;
  
    itemdata = new FormGroup({
      id: new FormControl(),
      itemName: new FormControl('',Validators.required),
      itemD: new FormControl('',Validators.required),
      itemPrice: new FormControl('',Validators.required),
      itemPath: new FormControl('',Validators.required),
      table_name: new FormControl('item_master'),
      action: new FormControl('insert'),
    })
  
  
    getdata() {
  
  
      this.user.postApicall("/paggination/test", this.formdata.value).subscribe((response: any) => {
        
        this.records = response.table;
        this.page_no = response.page_no;
        this.total_records = response.total_records;
      }
      )
  
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
      this.itemdata.reset();
      this.isSubmitVisible = true;;
      this.isUpdateVisible = false;
  
    }
  
    submit() {
     
      this.itemdata.patchValue({
        "action": 'insert',
        "table_name":"item_master"
      })
  
  
  
      if (this.itemdata.valid) {
        this.user.postApicall("/crud_operations/insert", this.itemdata.value).subscribe((response: any) => {
  
          if (response.status == 200) {
  
            this.itemdata.reset();
            Swal.fire({
              title: "Data inserted  successfully!",
              icon: "success",
              draggable: true
            });
            this.itemdata.reset();
            this.searchtab('search');
          
  
          }
        })
  
      }
      else {
        this.itemdata.markAllAsTouched();
      }
    }
  
    edit(id: number) {
      let obj: any = {
        "id": id,
        "action": "edit",
        "table_name": "item_master"
  
      }
      this.user.postApicall("/crud_operations/edit_delete_Fun", obj).subscribe((response: any) => {
        this.itemdata.controls['id'].setValue(response.data_for_edit[0].id);
        this.itemdata.controls['itemName'].setValue(response.data_for_edit[0].name);
  
        this.itemdata.controls['itemD'].setValue(response.data_for_edit[0].phone);
        this.itemdata.controls['itemPath'].setValue(response.data_for_edit[0].email);
      })
  
      this.result('result');
  
      this.isSubmitVisible = false;
      this.isUpdateVisible = true;
  
  
    }
  
    update() {
  
      this.itemdata.patchValue({
        "action": 'update',
        "table_name":"item_master"
      })
  
      this.user.postApicall("/crud_operations/update", this.itemdata.value).subscribe((response: any) => {
  
        if (response.status == 200) {
          Swal.fire({
            title: "Updated successfully!",
            icon: "success",
            draggable: true
          });
          this.searchtab('search');
        }
      })
  
    }
  
    delete(id: number) {
      let obj = {
        "action": 'delete',
        "id": id,
        "table_name": 'item_master'
      }
  
  
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
  
  
  
          this.user.postApicall("/crud_operations/edit_delete_Fun", obj).subscribe((response: any) => {
  
            if (response.data_for_edit == "deleted") {
              Swal.fire({
                title: "deleted successfully!",
                icon: "success",
                draggable: true,
  
              });
              this.getdata();
  
            }
          })
        }
      });
  
    }
  
  
  
  
    short(name: string) {
  
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
