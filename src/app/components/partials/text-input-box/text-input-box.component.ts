import { NgClass } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

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
  @Input() fieldLength!: 'short' | 'medium' | 'long' | 'extra-long' | 'zip-code'

  errorsText!: {category: string, message: string}[]
  inputLength!: number
  constructor() {}
  
  ngOnInit() {
    switch (this.fieldLength) {
      case 'short':
        this.inputLength = 20
        break;
      case 'medium':
        this.inputLength = 40
        break;
      case 'long':
        this.inputLength = 60
        break;
      case 'extra-long':
        this.inputLength = 80
        break;
      case 'zip-code':
        this.inputLength = 10
        break;
      default:
        this.inputLength = 40
        break;
    }

    this.errorsText = [
      { category: 'required', message: 'Field is required' },
      { category: 'minlength', message: `Miminum ${this.minlength} characters` },
      { category: 'email', message: 'Invalid email' },
      { category: 'password', message: 'Invalid password' },
      { category: 'passwordMatch', message: 'Passwords do not match' },
      { category: 'capsCheck', message: 'Atleast 1 capital letter' },
      { category: 'numCheck', message: 'Atleast 1 number' },
      { category: 'specialCharCheck', message: 'Atleast 1 special character' },
      {category: 'smallLetterCheck', message: 'Atleast 1 small letter'}
    ];
    // Check if all required inputs are provided
    this.errorsText = this.errorsText.filter((error) => (this.errorCategories.includes(error.category))
    )
  }

  get formController() {
    return this.control as FormControl;
  }
}
