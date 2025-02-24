import { Component, inject, Injectable, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationComponent } from '../validation/validation.component';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../api.service';
import { PagginationComponent } from '../paggination/paggination.component';

import { NgClass, NgFor, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { AutocompleteComponent } from "../autocomplete/autocomplete.component";

export interface dataformate {

  table: [],
  total_records: number,
  page_no: number

}

@Component({
  selector: 'app-invoicemaster',
  imports: [FormsModule, ReactiveFormsModule, ValidationComponent, PagginationComponent, NgIf, NgClass, NgFor, AutocompleteComponent],
  templateUrl: './invoicemaster.component.html',
  styleUrl: './invoicemaster.component.css'
})
export class InvoicemasterComponent implements dataformate,OnInit{

  
    table: [] = [];
    total_records: number = 0;
    page_no: number = 1;
  
    records: any[] = [];
    formdata: FormGroup;
    Data: any;

    item_auto:any[]=[];



   base_url ="http://localhost/Angular_Project/First_CI_Project";
  
   
   
  
    ngOnInit(): void {
      this.getdata();
      
    }
    constructor(private http: HttpClient, private api: ApiService) {
  
  
      this.formdata = new FormGroup({
        name: new FormControl(),
        phone: new FormControl(),
        email: new FormControl(),
        invoice_no: new FormControl(),
        invoice_date: new FormControl(),

        colname: new FormControl("id"),
        order: new FormControl("DESc"),
        page_no: new FormControl(1),
        row_no: new FormControl(4),
        table_name: new FormControl('invoice_master'),
  
      })
    }
  
  
  
  
    isSubmitVisible: boolean = true;
    isUpdateVisible: boolean = false;
  
    invoicedata = new FormGroup({
      id: new FormControl(),
      name: new FormControl('', [Validators.required]),
      phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]*$/)]),
      email: new FormControl('', [Validators.required, Validators.email]),
      address: new FormControl('', [Validators.required]),
      invoice_no: new FormControl('', [Validators.required]),
      client_id: new FormControl(),
      invoice_date: new FormControl('', [Validators.required]),
      total_amount: new FormControl('', [Validators.required]),
 
      table_name: new FormControl('invoice_master'),
      action: new FormControl('insert'),
      items: new FormArray([
        this.createItemFormGroup() 
      ])
    })
  
  
    getdata() {
      this.api.postApicall("/paggination/test", this.formdata.value).subscribe((response: any) => {
        this.records = response.table;
        this.page_no = response.page_no;
        this.total_records = response.total_records;
      }
      )
  
    }
  
    get items(): FormArray {
      return this.invoicedata.get('items') as FormArray;
    }

    createItemFormGroup(): FormGroup {
      return new FormGroup({
        item_id: new FormControl(),
        itemName: new FormControl('', Validators.required),
        itemPrice: new FormControl('', [Validators.required, Validators.pattern(/^[0-9]*$/)]),
        quantity: new FormControl('', [Validators.required, Validators.min(1)]),
        amount: new FormControl('', Validators.required),
      });
    }

    addItem() {
      this.items.push(this.createItemFormGroup());
    }

    deleteItem(index: number) {
      if (this.items.length > 1) {
        this.items.removeAt(index);
      }
    }
 
    reset() {
  
      this.formdata.controls['name'].reset();
      this.formdata.controls['phone'].reset();
      this.formdata.controls['email'].reset();
      
      this.formdata.controls['invoice_no'].reset();
      this.formdata.controls['invoice_date'].reset();
  
      this.getdata();
  
    }
  
    search() {
      this.formdata.controls['page_no'].setValue(1)
      this.getdata();
    }
  
  
  
    activeTab: any = 'search';
  
  
    searchtab(activeTab: any) {
      this.activeTab = activeTab;
      this.invoicedata.reset();
      this.isSubmitVisible = true;
      this.isUpdateVisible = false;
    }
  
    result(activeTab: any) {
  
      this.activeTab = activeTab;
  
      this.isSubmitVisible = true;
      this.isUpdateVisible = false;
  
    }
  
    submit() {
  
      this.invoicedata.patchValue({
        "action": 'insert',
        "table_name": "invoice_master"
      })
  
  
      let formData = new FormData();
      Object.entries(this.invoicedata.value).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      if (this.invoicedata.valid) {
  
        this.api.postApicall("/crud_operations/insert", formData).subscribe((response: any) => {
  
          if (response.status == 200) {
  
            this.invoicedata.reset();
            Swal.fire({
              title: "Data inserted  successfully!",
              icon: "success",
              draggable: true
            });
            this.invoicedata.reset();
            this.searchtab('search');
            this.getdata();
  
  
          }
          else {
            if (response.errors.email) {
  
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.errors.email,
  
              });
            } {
              Swal.fire({
                icon: "error",
                title: "Oops...",
                text: response.errors.phone,
  
              });
            }
  
          }
        })
  
      }
      else {
        this.invoicedata.markAllAsTouched();
      }
    }
  
    edit_delete(id: number, action: string) {
      let obj: any = {
        "id": id,
        "action": action,
        "table_name": "invoice_master"
  
      }
      this.api.postApicall("/crud_operations/edit_delete_Fun", obj).subscribe(
        (response: any) => {
          this.Data = response;
  
  
  
          if (action == "edit") {
  
            let editValue = this.Data.data_for_edit[0];
  
            delete editValue.PASSWORD;
            Object.entries(editValue).forEach(([key, value]) => {
              if (this.invoicedata.get(key)) {
  
                this.invoicedata.get(key)?.setValue(value);
              }
  

             
            })
            this.items.clear();
            if (this.items.length === 0) {
            
              this.items.push(this.createItemFormGroup());
            }
          
            this.items.at(0).patchValue({
              itemName: editValue.itemName,
              itemPrice: editValue.itemPrice,
              quantity: editValue.quantity,
              amount: editValue.amount
            });
          
            
            this.result('result');
           
            this.isSubmitVisible = false;
            this.isUpdateVisible = true;
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
                if (this.Data.data_for_edit == "deleted") {
                  Swal.fire({
                    title: "deleted successfully!",
                    icon: "success",
                    draggable: true,
  
                  });
                  this.getdata();
  
                }
  
              }
            });
  
  
          }
        },
        (error) => {
          Swal.fire({
            title: "can,t delete!",
            icon: "warning",
            draggable: true,
  
          });
        }
      );
  
    }
  
    update() {
  
      this.invoicedata.patchValue({
        "action": 'update',
        "table_name": "invoice_master"
      })
  
      let formData = new FormData();
      Object.entries(this.invoicedata.value).forEach(([key, value]) => {
        formData.append(key, value);
      });
  
      this.api.postApicall("/crud_operations/update", formData).subscribe((response: any) => {
  
        if (response.status == 200) {
          Swal.fire({
            title: "Updated successfully!",
            icon: "success",
            draggable: true
          });
          this.searchtab('search');
          this.invoicedata.reset();
          this.getdata();
        }
      })
  
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
 
