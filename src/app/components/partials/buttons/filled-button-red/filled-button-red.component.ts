import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { routes } from './../../../../app.routes';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-filled-button-red',
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
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
  @Input()
  routerLink: any = ''
  @Input()
  routerLinkActive!: string
  @Input()
  textForButton: string = ''
}
