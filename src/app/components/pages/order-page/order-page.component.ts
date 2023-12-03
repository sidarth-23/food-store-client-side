import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { trigger, transition, style, animate } from '@angular/animations';
import { OrderService } from '../../../services/order.service';
import { OrderSummary } from '../../../shared/interfaces/users/response.interface';

@Component({
  selector: 'app-order-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-page.component.html',
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
export class OrderPageComponent implements OnInit{
  initiation: boolean = false
  orderList!: OrderSummary[]

  constructor(
    private orderService: OrderService,
  ) {
  }
  ngOnInit(): void {
    this.initiation = true
    this.orderService.getOrders().subscribe((res) => {
      this.orderList = res
    })
  }

}
