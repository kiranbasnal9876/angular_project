import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  postApicall(controllerName: String, data: any) {

    return this.http.post("http://localhost/Angular_Project/api/index.php/" + controllerName, data,
      {
        headers: {
      'authorization':  localStorage.getItem('token') || ''

        }
      }
    )

  }

        // number only function 
        only_number(event: any): boolean {
          const charCode = (event.which) ? event.which : event.keyCode;
          if (charCode > 31 && (charCode < 48 || charCode > 57)) {
              return false;
          }
          return true;
      }
  
  
      //decimal number
      decimal_number(event: any): boolean {
          const charCode = event.which ? event.which : event.keyCode;
          const inputElement = event.target as HTMLInputElement;
          const currentValue = inputElement.value;
          if ((charCode >= 48 && charCode <= 57) || (charCode === 46 && !currentValue.includes('.'))) {
              return true;
          }
  
          event.preventDefault();
          return false;
      }


      getTokenData(token: string | null): any {
        try {
          if (!token || token.split('.').length !== 3) {
            throw new Error('Invalid token format');
          }
          const decoded: any = jwtDecode(token);
          return decoded.data; 
        } catch (error) {
          console.error('Invalid token:', error);
          return null;
        }
      }
      
      

}
