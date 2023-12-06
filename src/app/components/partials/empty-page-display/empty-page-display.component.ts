import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FilledButtonRedComponent } from '../buttons/filled-button-red/filled-button-red.component';

@Component({
  selector: 'app-empty-page-display',
  standalone: true,
  imports: [RouterLink, FilledButtonRedComponent],
  templateUrl: './empty-page-display.component.html',
  styles: ``
})
export class EmptyPageDisplayComponent {
  @Input() pageName!: string;
}
