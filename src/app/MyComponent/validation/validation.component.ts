import { Component, input } from '@angular/core';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-validation',
  imports: [],
  templateUrl: './validation.component.html',
  styleUrl: './validation.component.css'
})
export class ValidationComponent {
  formname = input<FormGroup>();
  fieldname= input<string>('');
  maxlength= input<number>();
  minlength= input<number>();
  label= input<string>('');

}
