import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EncrptComponent } from '../encrpt/encrpt.component';
@Component({
  selector: 'app-log-in',
  imports: [FormsModule,ReactiveFormsModule,NgIf],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {

  formdata:FormGroup;

  constructor(private http: HttpClient, private router: Router,private encrpt_data:EncrptComponent){
    this.formdata = new FormGroup({
      email : new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    })
  }



  showelement: boolean = false;

  check() {
    if (this.formdata.valid) {
      const logInData: LogIn = this.formdata.value;
      this.http.post("http://localhost/angular_project/api/index.php/Log_in", logInData, {
        headers: {
          'Content-Type': 'application/json' 
        }
      }).subscribe((responce: any) => {
        
         if(responce.error){
          alert("may your email or password is wrong");
        }
      else{
 
          localStorage.setItem('token',responce.user_data);
          this.router.navigate(['dashboard/home']);
         
        }
       
      },
        (error) => {
          alert(error.message);
          
        }
      )
      this.showelement = false;
    }
    else {
      this.showelement = true;
    }
  }



}


export class LogIn {
  EmailId: String
  Password: String
  constructor() {
    this.EmailId = '',
      this.Password = ''
  }
}
