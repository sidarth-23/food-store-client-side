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
