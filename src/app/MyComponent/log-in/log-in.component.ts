import { NgIf } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
@Component({
  selector: 'app-log-in',
  imports: [FormsModule,ReactiveFormsModule,NgIf],
  templateUrl: './log-in.component.html',
  styleUrl: './log-in.component.css'
})
export class LogInComponent {

  formdata:FormGroup;

  constructor(private http: HttpClient, private router: Router){
    this.formdata = new FormGroup({
      email : new FormControl('',[Validators.required]),
      password: new FormControl('',[Validators.required])
    })
  }



  showelement: boolean = false;

  check() {
    if (this.formdata.valid) {
      const logInData: LogIn = this.formdata.value;
      // console.log('Form Submitted:', logInData);
      

      this.http.post("http://localhost/First_CI_Project/logInPage/log_data", logInData, {
        headers: {
          'Content-Type': 'application/json' 
        }
      }).subscribe((responce: any) => {
        if (responce.status==200) {
          // alert(" You are Logged In");
          this.router.navigate(['dashboard']);
        }
        else
        {
        alert("may your email or password is wrong");
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
