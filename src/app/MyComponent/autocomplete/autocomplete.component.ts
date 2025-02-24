import { Component, effect, input, signal } from '@angular/core';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-autocomplete',
  imports: [],
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent {

  valueName = input<string>('');
  item_auto = signal<any[]>([]);

  constructor(private myAuto: ApiService) {
    effect(() => {
      if (this.valueName()) {
        this.autocomplete();
      }
    })

  }



  autocomplete() {
    if (this.valueName() === '') {
      this.item_auto.set([]);
    }

    this.myAuto.postApicall("/invoice_crudOperations/itemAutoComplete", this.valueName()).subscribe((response: any) => {
      this.item_auto.set(response.output);
    })




  }



}
