import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'app-summary-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './summary-page.component.html',
  styles: ``,
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class SummaryPageComponent implements OnInit{
  initiation: boolean = false

  ngOnInit(): void {
    this.initiation = true
  }
}
