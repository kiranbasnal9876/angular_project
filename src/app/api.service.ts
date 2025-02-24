import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {


  }

  postApicall(controllerName: String, data: any) {

    return this.http.post("http://localhost/Angular_Project/First_CI_Project" + controllerName, data,
      // {
      //   headers: {
      //     'Content-Type': 'application/json'
      //   }
      // }
    )

  }
  



}
