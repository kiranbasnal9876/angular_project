import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ApiService } from '../../api.service';

@Component({
  selector: 'app-home',
  imports: [RouterOutlet,RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  user_data: number | undefined;
  client_data: number |undefined;
  item_data: number | undefined;
  total_invoice: any | undefined;

  ngOnInit(): void {
    this.get_records();
  }

  constructor(private api: ApiService) {

  }

  get_records(){
    this.api.postApicall("dashboard", '').subscribe((response: any) => {
      this.user_data = response.data.user_data;
      this.client_data = response.data.client_data;
      this.item_data = response.data.item_data;
      this.total_invoice=response.data.invoice_data[0].total;
    }
    )
  }

}
