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
  selector: 'app-usermaster',
  imports: [FormsModule, ReactiveFormsModule, ValidationComponent, PagginationComponent, NgIf, NgClass],
  templateUrl: './usermaster.component.html',
  styleUrl: './usermaster.component.css'
})


@Injectable({
  providedIn: 'root'
})


export class UsermasterComponent implements OnInit, dataformate {

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
      name: new FormControl(),
      phone: new FormControl(),
      email: new FormControl(),

      colname: new FormControl("id"),
      order: new FormControl("DESc"),
      page_no: new FormControl(1),
      row_no: new FormControl(4),
      table_name: new FormControl('user_master'),

    })
  }


  isSubmitVisible: boolean = true;
  isUpdateVisible: boolean = false;

  userdata = new FormGroup({
    id: new FormControl(),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10) ,Validators.pattern(/^[0-9]*$/) ]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30),Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,30}$/)]),
    table_name: new FormControl('user_master'),
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

    this.formdata.controls['name'].reset();
    this.formdata.controls['phone'].reset();
    this.formdata.controls['email'].reset();

    this.getdata();

  }

  search() {
    this.formdata.controls['page_no'].setValue(1)
    this.getdata();
  }



  activeTab: any = 'search';


  searchtab(activeTab: any) {
    this.activeTab = activeTab;
    this.userdata.reset();
    this.isSubmitVisible = true;;
    this.isUpdateVisible = false;
  }

  result(activeTab: any) {

    this.activeTab = activeTab;
    this.userdata.reset();
    this.isSubmitVisible = true;;
    this.isUpdateVisible = false;

  }

  submit() {
   
    this.userdata.patchValue({
      "action": 'insert',
      "table_name":"user_master"
    })



    if (this.userdata.valid) {
      this.user.postApicall("/crud_operations/insert", this.userdata.value).subscribe((response: any) => {

        if (response.status == 200) {

          this.userdata.reset();
          Swal.fire({
            title: "Data inserted  successfully!",
            icon: "success",
            draggable: true
          });
          this.userdata.reset();
          this.searchtab('search');
        

        }
      })

    }
    else {
      this.userdata.markAllAsTouched();
    }
  }

  edit(id: number) {
    let obj: any = {
      "id": id,
      "action": "edit",
      "table_name": "user_master"

    }
    this.user.postApicall("/crud_operations/edit_delete_Fun", obj).subscribe((response: any) => {
      this.userdata.controls['id'].setValue(response.data_for_edit[0].id);
      this.userdata.controls['name'].setValue(response.data_for_edit[0].name);

      this.userdata.controls['phone'].setValue(response.data_for_edit[0].phone);
      this.userdata.controls['email'].setValue(response.data_for_edit[0].email);
    })

    this.result('result');

    this.isSubmitVisible = false;
    this.isUpdateVisible = true;


  }

  update() {

    this.userdata.patchValue({
      "action": 'update',
      "table_name":"user_master"
    })

    this.user.postApicall("/crud_operations/update", this.userdata.value).subscribe((response: any) => {

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
      "table_name": 'user_master'
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
