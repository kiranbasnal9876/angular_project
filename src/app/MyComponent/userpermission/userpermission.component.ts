import { Component } from '@angular/core';
import { ApiService } from '../../api.service';
import { CommonModule, NgIf } from '@angular/common';
import { FormArray, FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

interface menupermission {
  menu_id: string,
  user_id: string,
  menu_name: string,
  add_records: string,
  update_records: string,
  delete_records: string,
  view_page: string,
}

@Component({
  selector: 'app-userpermission',
  imports: [NgIf, ReactiveFormsModule, CommonModule],
  templateUrl: './userpermission.component.html',
  styleUrl: './userpermission.component.css'
})
export class UserpermissionComponent {

  Users: any = [];
  menu_permission: menupermission[] = [{
    user_id: '',
    menu_id: '',
    menu_name: '',
    add_records: '',
    update_records: '',
    delete_records: '',
    view_page: ''
  }];
  showDetails: boolean = false;
  user_id: any;
  constructor(private api: ApiService) {
    this.get_all_users();
  }


  get_all_users() {
    this.api.postApicall('User_permission/get_users', '').subscribe((res: any) => {
      this.Users = res.data;
    })

  }

  check_permission(id: string) {
    if (id == "0") {
      this.showDetails = false;
    }
    else {
      this.user_id = id;
      this.api.postApicall('User_permission/permission_records', id).subscribe((res: any) => {
        if (res.code == 200) {
          this.showDetails = true;
          this.menu_permission = res.data;
          this.permission_data.clear();
          this.menu_permission.forEach((ele: any, index: number) => {
            this.permission_data.push(this.createFormArray());
            this.permission_data.at(index).patchValue({
              'menu_name': ele.menu_name,
              'user_id': this.user_id,
              'menu_id': ele.menu_id,
              'add_records': this.convertToBoolean(ele.add_records),
              'update_records': this.convertToBoolean(ele.update_records),
              'delete_records': this.convertToBoolean(ele.delete_records),
              'view_page': this.convertToBoolean(ele.view_records),
            })

          })

        }
      })
    }
  }


  permission_form: FormGroup = new FormGroup({
    permission_data: new FormArray<any>([
      this.createFormArray()
    ])
  })


  get permission_data(): FormArray {
    return this.permission_form.get('permission_data') as FormArray;
  }


  createFormArray(): FormGroup {
    return new FormGroup({
      menu_name: new FormControl(),
      menu_id: new FormControl(),
      user_id: new FormControl(this.user_id),
      add_records: new FormControl(),
      update_records: new FormControl(),
      delete_records: new FormControl(),
      view_page: new FormControl(),
    })
  }


  convertToBoolean(value: any): boolean {
    return value == 1 ? true : false;
  }


  submit() {
    this.api.postApicall('User_permission/add_permission_records', this.permission_form.value).subscribe((responce: any) => {
      if (responce.code == 200) {
        Swal.fire({
          title: responce.data,
          icon: "success",
          draggable: true,

        });
      }
      else {
        Swal.fire({
          icon: "error",
          title: "Oops...",
          text: responce.data,

        });
      }
    })
  }


}
