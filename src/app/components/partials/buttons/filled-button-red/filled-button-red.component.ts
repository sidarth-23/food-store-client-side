import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filled-button-red',
  standalone: true,
  imports: [],
  templateUrl: './filled-button-red.component.html',
  styles: ``
})
export class FilledButtonRedComponent {
  @Input()
  disabled: boolean = false;
  @Input()
  type: string = 'submit';
  @Output()
  onClick = new EventEmitter()
}
