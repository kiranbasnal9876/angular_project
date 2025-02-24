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

@Component({
  selector: 'app-clientmaster',
  imports: [FormsModule, ReactiveFormsModule, ValidationComponent, PagginationComponent, NgIf, NgClass],
  templateUrl: './clientmaster.component.html',
  styleUrl: './clientmaster.component.css'
})



export class ClientmasterComponent implements OnInit, dataformate {

  table: [] = [];
  total_records: number = 0;
  page_no: number = 1;

  records: any[] = [];
  formdata: FormGroup;
  Data: any;

  states:any[]=[];
  district:any[]=[];

  ngOnInit(): void {
    this.getdata();
    this.getstates();
  }
  constructor(private http: HttpClient, private api: ApiService) {


    this.formdata = new FormGroup({
      name: new FormControl(),
      phone: new FormControl(),
      email: new FormControl(),
      address: new FormControl(),
      colname: new FormControl("id"),
      order: new FormControl("DESc"),
      page_no: new FormControl(1),
      row_no: new FormControl(4),
      table_name: new FormControl('client_master'),

    })
  }




  isSubmitVisible: boolean = true;
  isUpdateVisible: boolean = false;

  clientdata = new FormGroup({
    id: new FormControl(),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]*$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    state_id: new FormControl('', [Validators.required]),
    district_id: new FormControl('', [Validators.required]),
    pincode: new FormControl('', [Validators.required,Validators.minLength(4),Validators.maxLength(8)]),
   
    table_name: new FormControl('client_master'),
    action: new FormControl('insert'),
  })


  getdata() {


    this.api.postApicall("/paggination/test", this.formdata.value).subscribe((response: any) => {

      this.records = response.table;
      this.page_no = response.page_no;
      this.total_records = response.total_records;

      
    }
    )

  }


  getstates(){
    this.api.postApicall("/crud_operations/getStates",'').subscribe((response: any) => {
      this.states = response.states;
     
    })

   
  }

  getdistrict(id:string){
  this.district=[];
    this.api.postApicall("/crud_operations/get_destrict",id).subscribe((response: any) => {
      this.district = response.district;
     
    })
      
  }

  reset() {

    this.formdata.controls['name'].reset();
    this.formdata.controls['phone'].reset();
    this.formdata.controls['email'].reset();
    this.formdata.controls['address'].reset();

    this.getdata();

  }

  search() {
    this.formdata.controls['page_no'].setValue(1)
    this.getdata();
  }



  activeTab: any = 'search';


  searchtab(activeTab: any) {
    this.activeTab = activeTab;
    this.clientdata.reset();
    this.isSubmitVisible = true;;
    this.isUpdateVisible = false;
  }

  result(activeTab: any) {

    this.activeTab = activeTab;

    this.isSubmitVisible = true;;
    this.isUpdateVisible = false;

  }

  submit() {

    this.clientdata.patchValue({
      "action": 'insert',
      "table_name": "client_master"
    })


    let formData = new FormData();
    Object.entries(this.clientdata.value).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (this.clientdata.valid) {

      this.api.postApicall("/crud_operations/insert", formData).subscribe((response: any) => {

        if (response.status == 200) {

          this.clientdata.reset();
          Swal.fire({
            title: "Data inserted  successfully!",
            icon: "success",
            draggable: true
          });
          this.clientdata.reset();
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
      this.clientdata.markAllAsTouched();
    }
  }

  edit_delete(id: number, action: string) {
    let obj: any = {
      "id": id,
      "action": action,
      "table_name": "client_master"

    }
    this.api.postApicall("/crud_operations/edit_delete_Fun", obj).subscribe(
      (response: any) => {
        this.Data = response;



        if (action == "edit") {

          let editValue = this.Data.data_for_edit[0];

          delete editValue.PASSWORD;
          Object.entries(editValue).forEach(([key, value]) => {
            if (this.clientdata.get(key)) {

              this.clientdata.get(key)?.setValue(value);
            }

          })
          
          this.result('result');
          this.getdistrict(editValue.state_id);
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

    this.clientdata.patchValue({
      "action": 'update',
      "table_name": "client_master"
    })

    let formData = new FormData();
    Object.entries(this.clientdata.value).forEach(([key, value]) => {
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
        this.clientdata.reset();
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
