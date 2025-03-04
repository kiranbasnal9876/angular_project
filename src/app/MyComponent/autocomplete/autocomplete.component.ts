import { Component, effect, Input, input, signal } from '@angular/core';
import { ApiService } from '../../api.service';
import { FormArray, FormGroup } from '@angular/forms';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-autocomplete',
  imports: [NgIf],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent {

  valueName = input<string>('');
  item_auto = signal<any[]>([]);
  
  @Input()  formname : FormGroup | undefined;
  @Input()  formdata : Function | undefined;

  @Input() fields:string[]|undefined;

 name = input<string>();
  autoSuggestion:boolean=true;

  constructor(private myAuto: ApiService) {
    effect(() => {
      if (this.valueName().trim()) {
        if(this.name()==='item'){
          this.item_autocomplete();
        }
        else{
          this.client_autocomplete();
        }
        
       
      }
      if (this.valueName().trim() === '') {
        this.item_auto.set([]);
      }

      
    })

  }



  item_autocomplete() {
    const formdata = new FormData();
    formdata.append('value',this.valueName());

    

    this.myAuto.postApicall("invoice_master/item_autocomplete", formdata).subscribe((response: any) => {
      this.item_auto.set(response.output);
    })

  }

 

  client_autocomplete(){
   
    const formdata = new FormData();
    formdata.append('name',this.valueName());

    

    this.myAuto.postApicall("invoice_master/client_autocomplete", formdata).subscribe((response: any) => {
      this.item_auto.set(response.output);
     
     
    })

  }

  auto_fill(id: number){
    this.autoSuggestion=false;

    const selectedItem = this.item_auto().find(item => item.id === id);
   
    
    this.fields?.forEach((key)=>{
      this.formname?.get(key)?.setValue(selectedItem[key]);
    })
    if(this.name()==='item'){

      
   
    this.formname?.get('item_id')?.setValue(selectedItem.id);
    this.formname?.get('quantity')?.setValue(1);

    this.formname?.get('amount')?.setValue(this.formname.get('quantity')?.value*this.formname?.get('itemPrice')?.value);
 
if(this.formdata){
  this.formdata();
}

    }

    else{
      this.formname?.get('client_id')?.setValue(selectedItem.id);

    }

  }
  




}
