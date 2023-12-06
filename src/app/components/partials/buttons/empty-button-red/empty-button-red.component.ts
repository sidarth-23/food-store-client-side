import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-empty-button-red',
  standalone: true,
  imports: [],
  templateUrl: './empty-button-red.component.html',
  styles: ``
})
export class EmptyButtonRedComponent {
  @Input()
  disabled: boolean = false;
  @Input()
  type: string = 'submit';
  @Output()
  onClick = new EventEmitter()
}
