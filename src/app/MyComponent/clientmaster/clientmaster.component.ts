import { Component, inject, Injectable, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationComponent } from '../validation/validation.component';
import { HttpClient } from '@angular/common/http';
import { ApiService } from '../../api.service';
import { PagginationComponent } from '../paggination/paggination.component';

import { NgClass, NgIf } from '@angular/common';
import Swal from 'sweetalert2';
import { response } from 'express';


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

  states: any[] = [];
  district: any[] = [];

  ngOnInit(): void {
    this.getdata();
    this.getstates();
    this.permission_data();
  }
  constructor(public api: ApiService) {


    this.formdata = new FormGroup({
      name: new FormControl(),
      phone: new FormControl(),
      email: new FormControl(),
      address: new FormControl(),
      colname: new FormControl("id"),
      order: new FormControl("DESc"),
      page_no: new FormControl(1),
      row_no: new FormControl(4),


    })
  }

  add_permission: boolean = true;
  delete_permission:boolean=true;
  update_permission:boolean=true;


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
    pincode: new FormControl('', [Validators.required, Validators.minLength(4), Validators.maxLength(8)]),


  })


  getdata() {
    this.api.postApicall("Client_master/get_client_data", this.formdata.value).subscribe((response: any) => {
      this.records = response.data.table;
      this.page_no = response.data.page_no;
      this.total_records = response.data.total_page;
     
    }
    )
  }


  convertTobool(val:any)
  {
    if(val==1){return true; }
    else{  return false; }
    }

  getstates() {
    this.api.postApicall("Client_master/get_states", '').subscribe((response: any) => {
      this.states = response.states;

    })
  }

  getdistrict(id: string) {
    this.district = [];
    this.api.postApicall("client_master/get_destrict", id).subscribe((response: any) => {
      this.district = response.district;

    })

  }


  permission_data(){
  this.api.postApicall("client_master/get_permission",'').subscribe((response:any)=>{
   const permission = response.data;
   this.add_permission =this.convertTobool(permission[0].add_records);  
   this.delete_permission=this.convertTobool(permission[0].delete_records);
   this.update_permission=this.convertTobool(permission[0].update_records); 
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
    let formData = new FormData();
    Object.entries(this.clientdata.value).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (this.clientdata.valid) {

      this.api.postApicall("client_master/insert_client_data", formData).subscribe((response: any) => {

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


    if (action == "edit") {

      this.api.postApicall("client_master/edit_client_data", id).subscribe(
        (response: any) => {

          let editValue = response.data[0];




          Object.entries(editValue).forEach(([key, value]) => {
            if (this.clientdata.get(key)) {

              this.clientdata.get(key)?.setValue(value);
            }

          })
          this.result('result');
          this.getdistrict(editValue.state_id);
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
          this.api.postApicall("client_master/delete_client_data", id).subscribe(
            (response: any) => {

              if (response.status == 200) {
                Swal.fire({
                  title: "deleted successfully!",
                  icon: "success",
                  draggable: true,

                });
                this.getdata();

              }
              else {
                Swal.fire({
                  title: "data not deleted!",
                  icon: "warning",
                  draggable: true,

                });

              }
            },
            (error) => {
              Swal.fire({
                title: "you can't  delet this client!",
                icon: "warning",
                draggable: true,

              });
            }
          );


        }
      });


    }


  }


  update() {

    let formData = new FormData();
    Object.entries(this.clientdata.value).forEach(([key, value]) => {
      formData.append(key, value);
    });

    this.api.postApicall("client_master/update_client_data", formData).subscribe((response: any) => {

      if (response.code == 200) {
        Swal.fire({
          title: "Updated successfully!",
          icon: "success",
          draggable: true
        });
        this.searchtab('search');
        this.clientdata.reset();
        this.getdata();
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: response.error,
        });

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
