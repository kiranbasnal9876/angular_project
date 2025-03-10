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




export class UsermasterComponent implements OnInit, dataformate {



  table: [] = [];
  total_records: number = 0;
  page_no: number = 1;

  records: any[] = [];
  formdata: FormGroup;
  Data: any;

  public theCallback: Function | undefined;



  ngOnInit(): void {
    this.getdata();
    this.permission_data();
    this.theCallback = this.getdata;
  }


  constructor(public user: ApiService) {


    this.formdata = new FormGroup({
      name: new FormControl(),
      phone: new FormControl(),
      email: new FormControl(),

      colname: new FormControl("id"),
      order: new FormControl("DESc"),
      page_no: new FormControl(1),
      row_no: new FormControl(4),



    })
  }




  isSubmitVisible: boolean = true;
  isUpdateVisible: boolean = false;

  userdata = new FormGroup({
    id: new FormControl(),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]*$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    PASSWORD: new FormControl('', [Validators.required, Validators.minLength(8), Validators.maxLength(30), Validators.pattern(/^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,30}$/)]),

  })

  add_permission: boolean = true;
  delete_permission: boolean = true;
  update_permission: boolean = true;

  getdata() {
    this.user.postApicall("user_master/get_user_data", this.formdata.value).subscribe((response: any) => {
      this.records = response.data.table;
      this.page_no = response.data.page_no;
      this.total_records = response.data.total_page;
    }
    )

  }

  convertTobool(val: any) {
    if (val == 1) {
      return true;
    }
    else {
      return false;
    }
  }
  permission_data() {
    this.user.postApicall("item_master/get_permission", '').subscribe((response: any) => {
      const permission = response.data;
      this.add_permission = this.convertTobool(permission[0].add_records);
      this.delete_permission = this.convertTobool(permission[0].delete_records);
      this.update_permission = this.convertTobool(permission[0].update_records);
    })
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

    this.isSubmitVisible = true;;
    this.isUpdateVisible = false;

  }

  submit() {



    let formData = new FormData();
    Object.entries(this.userdata.value).forEach(([key, value]) => {
      formData.append(key, value);
    });

    if (this.userdata.valid) {

      this.user.postApicall("user_master/insert_user_data", formData).subscribe((response: any) => {

        if (response.status == 200) {

          this.userdata.reset();
          Swal.fire({
            title: response.message,
            icon: "success",
            draggable: true
          });

          this.searchtab('search');
        }
        else {
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: response.errors.email || response.errors.phone,
          });
        }

      })
    }
    else {
      this.userdata.markAllAsTouched();
    }
  }





  edit_delete(id: number, action: string) {


    if (action == "edit") {

      this.user.postApicall("user_master/edit_user_data", id).subscribe(
        (response: any) => {

          let editValue = response.data[0];



          delete editValue.PASSWORD;
          Object.entries(editValue).forEach(([key, value]) => {
            if (this.userdata.get(key)) {

              this.userdata.get(key)?.setValue(value);
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
          this.user.postApicall("user_master/delete_user_data", id).subscribe(
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
              alert('not a valid call');
            }
          );


        }
      });


    }


  }

  update() {

    let formData = new FormData();
    Object.entries(this.userdata.value).forEach(([key, value]) => {
      formData.append(key, value);
    });

    this.user.postApicall("user_master/update_user_data", formData).subscribe((response: any) => {

      if (response == 1) {
        Swal.fire({
          title: "Updated successfully!",
          icon: "success",
          draggable: true
        });
        this.searchtab('search');
        this.userdata.reset();
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
