import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-form-header',
  standalone: true,
  imports: [],
  templateUrl: './form-header.component.html',
  styles: ``
})
export class FormHeaderComponent {
  @Input()  pageName!: string;
  @Input() title!: string;
  @Input() subtitle!: string;
}
