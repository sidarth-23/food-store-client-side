import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AbstractControl, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-select-input-box',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule],
  templateUrl: './select-input-box.component.html',
  styles: ``,
})
export class SelectInputBoxComponent implements OnInit{
  @Input()
  label!: string;
  @Input()
  name!: string;
  @Input()
  ifCondition!: boolean;
  @Input()
  list: string[] = [];
  @Input()
  control!: AbstractControl;
  @Input()
  elseLabel: string = '';
  @Output()
  onChange: EventEmitter<any> = new EventEmitter();

  ngOnInit(): void {
  }

  get formController() {
    return this.control as FormControl;
  }
}
