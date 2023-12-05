import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-checkbox',
  standalone: true,
  imports: [],
  templateUrl: './checkbox.component.html',
  styles: ``,
})
export class CheckboxComponent {
  @Input()
  label!: string;
  @Input()
  content!: string;
  @Input()
  checked!: boolean;

  @Output()
  checkedChange: EventEmitter<boolean> = new EventEmitter<boolean>();

  onChangeEvent() {
    this.checked = !this.checked;
    this.checkedChange.emit(this.checked);
  }
}
