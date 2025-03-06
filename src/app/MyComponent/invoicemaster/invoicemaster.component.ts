import { Component, effect, inject, Injectable, OnInit } from '@angular/core';
import { FormArray, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { ValidationComponent } from '../validation/validation.component';
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
export class InvoicemasterComponent implements dataformate, OnInit {
  table: [] = [];
  total_records: number = 0;
  page_no: number = 1;
  records: any[] = [];
  formdata: FormGroup;
  Data: any;
  item_auto: any[] = [];
  isEditingItem: boolean[] = [];
  base_url = "http://localhost/Angular_Project/api/invoice_master";
  authorization = localStorage.getItem('token') || '';
  ngOnInit(): void {
    this.getdata();
    this.total();
    this.getInvoice_number_date();
    this.permission_data();
  }
  constructor(public api: ApiService) {
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
    })
  }

  isSubmitVisible: boolean = true;
  isUpdateVisible: boolean = false;
  add_permission: boolean = true;
  delete_permission: boolean = true;
  update_permission: boolean = true;
  invoicedata = new FormGroup({
    id: new FormControl(),
    name: new FormControl('', [Validators.required]),
    phone: new FormControl('', [Validators.required, Validators.minLength(10), Validators.pattern(/^[0-9]*$/)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    address: new FormControl('', [Validators.required]),
    invoice_no: new FormControl('', [Validators.required]),
    client_id: new FormControl(),
    invoice_date: new FormControl('', [Validators.required]),
    total_amount: new FormControl(0, [Validators.required]),
    items: new FormArray([
      this.createItemFormGroup()
    ])
  })


  getdata(){
    this.api.postApicall("invoice_master/get_invoice_data", this.formdata.value).subscribe((response: any) => {
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

  getInvoice_number_date(){
    this.api.postApicall("invoice_master/last_invoice_number", '').subscribe((response: any) => {
      this.invoicedata.get('invoice_no')?.setValue("100" + (Number(response.id) + 2));
    })
    this.invoicedata.get('invoice_date')?.setValue(new Date().toISOString().split('T')[0]);
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
    this.total();
  }

  get_amount(i: number) {

    let price = this.items.at(i).get('itemPrice')?.getRawValue();
    let quantity = this.items.at(i).get('quantity')?.getRawValue();
    let total_amount = parseFloat((price * quantity).toFixed(2));
    this.items.at(i).get('amount')?.setValue(total_amount);
    this.total();

  }

  total() {
    let total = 0;
    for (let j = 0; j < this.items.length; j++) {
      let total_price = this.items.at(j).get('itemPrice')?.getRawValue();
      let total_quantity = this.items.at(j).get('quantity')?.getRawValue();
      let total_value = total_price * total_quantity;
      total += total_value;
    }
    total = parseFloat(total.toFixed(2));
    this.invoicedata.get('total_amount')?.setValue(total);
  }



  permission_data(){
    this.api.postApicall("invoice_master/get_permission",'').subscribe((response:any)=>{
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
    this.isSubmitVisible = true;
    this.isUpdateVisible = false;
    this.invoicedata.reset();
  }

  result(activeTab: any) {

    this.activeTab = activeTab;

    this.isSubmitVisible = true;
    this.isUpdateVisible = false;


  }

  submit() {


    let formData = new FormData();
    this.invoicedata.markAllAsTouched();

    Object.entries(this.invoicedata.value).forEach(([key, value]) => {
      if (key !== 'items') {
        formData.append(key, value as string);
      }
    });
    const itemsArray = this.invoicedata.get('items') as FormArray;
    itemsArray.controls.forEach((group: any) => {
      formData.append("item_id[]", group.get('item_id')?.value);
      formData.append("quantity[]", group.get('quantity')?.value);
      formData.append("amount[]", group.get('amount')?.value);
    });

    if (this.invoicedata.get('client_id')?.value != '' && this.invoicedata.get('item_id')?.value != '') {

      this.api.postApicall("invoice_master/insert_invoice_data", formData).subscribe((response: any) => {

        if (response.status == 200) {


          Swal.fire({
            title: "Data inserted  successfully!",
            icon: "success",
            draggable: true
          });
          this.invoicedata.reset();
          this.searchtab('search');
          this.getdata();


        }



      })

    }
    else {
      this.invoicedata.markAllAsTouched();
    }
  }

  edit_delete(id: number, action: string) {


    if (action == "edit") {

      this.api.postApicall("invoice_master/edit_invoice_data", id).subscribe(
        (response: any) => {


          let editValue = response.data[0];

          Object.entries(editValue).forEach(([key, value]) => {
            if (this.invoicedata.get(key)) {

              this.invoicedata.get(key)?.setValue(value);
            }

          })
          this.items.clear();


          response.items.map((ele: any, index: any) => {
            this.items.push(this.createItemFormGroup());

            this.items.at(index).patchValue({
              item_id: ele.item_id,
              itemName: ele.itemName,
              itemPrice: ele.itemPrice,
              quantity: ele.quantity,
              amount: ele.amount
            });

            this.isEditingItem[index] = true;

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
          this.api.postApicall("invoice_master/delete_invoice_data", id).subscribe(
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
  createCloneItemsForm() {
    throw new Error('Method not implemented.');
  }


  enableAutocomplete(index: number) {
    this.isEditingItem[index] = false;
  }


  update() {

    let formData = new FormData();

    Object.entries(this.invoicedata.value).forEach(([key, value]) => {
      if (key !== 'items') {
        formData.append(key, value as string);
      }
    });
    const itemsArray = this.invoicedata.get('items') as FormArray;
    itemsArray.controls.forEach((group: any) => {
      formData.append("item_id[]", group.get('item_id')?.value);
      formData.append("quantity[]", group.get('quantity')?.value);
      formData.append("amount[]", group.get('amount')?.value);
    });

    this.api.postApicall("invoice_master/update_invoice_data", formData).subscribe((response: any) => {

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

  invoiceNo: number | null = 0;

  download_pdf(id: number) {
    this.api.postApicall("invoice_master/download_pdf", id).subscribe((response: any) => {
      this.invoiceNo = response;

    })
  }

  email_send: boolean = false;

  mail_send() {
    this.email_send = true;
    this.email_data.get('invoice_no')?.setValue(this.invoiceNo);
    console.log(this.email_data.value);
    let formData = new FormData();

    Object.entries(this.email_data.value).forEach(([key, value]) => {

      formData.append(key, value as string);

    });
    if (this.email_data.valid)
      this.api.postApicall("EmailController/send_mail", formData).subscribe((response: any) => {
        if (response.status == 200) {
          this.email_send = false;
          this.email_data.reset();
        }
      })

  }


  email_data = new FormGroup({
    sender: new FormControl('dimpalbasnal0@gmail.com'),
    send_to: new FormControl(''),
    content: new FormControl(''),
    subject: new FormControl(''),
    invoice_no: new FormControl(0),

  })



  all_itemsDelete() {

    while (this.items.length > 1) {
      this.items.removeAt(1);
    }
    if (this.items.length === 1) {
      this.items.at(0).reset();
    }
  }

}

