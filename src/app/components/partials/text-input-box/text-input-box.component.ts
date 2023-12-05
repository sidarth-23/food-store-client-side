import { NgClass } from '@angular/common';
import { Component, Input, OnInit, forwardRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-text-input-box',
  standalone: true,
  imports: [NgClass, FormsModule, ReactiveFormsModule],
  templateUrl: './text-input-box.component.html',
  styles: ``,
})
export class TextInputBoxComponent implements OnInit {
  @Input() withInfoIcon: boolean = false;
  @Input() errorCategories: string[] = []
  @Input() minlength: number = 0;
  @Input() label!: string;
  @Input() type!: string;
  @Input() control!: AbstractControl;
  @Input() asterix: boolean = false;

  errorsText!: {category: string, message: string}[]

  constructor() {}
  
  ngOnInit() {
    this.errorsText = [
      { category: 'required', message: 'Field is required' },
      { category: 'minlength', message: `Miminum ${this.minlength} characters` },
      { category: 'email', message: 'Invalid email' },
      { category: 'password', message: 'Invalid password' },
      { category: 'passwordMatch', message: 'Passwords do not match' },
      { category: 'capsCheck', message: 'Atleast 1 capital letter' },
      { category: 'numberCheck', message: 'Atleast 1 number' },
      { category: 'specialCharCheck', message: 'Atleast 1 special character' },
    ];
    // Check if all required inputs are provided
    this.errorsText = this.errorsText.filter((error) => (this.errorCategories.includes(error.category))
    )
    if (this.formController.errors){
      console.log(this.formController.errors['required'])
    }
  }

  get formController() {
    return this.control as FormControl;
  }
}
