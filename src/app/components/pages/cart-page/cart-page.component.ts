import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StarRatingComponent } from '../../partials/star-rating/star-rating.component';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from '../../../services/user.service';
import { IUserCart } from '../../../shared/interfaces/users/response.interface';
import { RouterLink } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-page',
  standalone: true,
  imports: [CommonModule, StarRatingComponent, RouterLink],
  templateUrl: './cart-page.component.html',
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
export class CartPageComponent implements OnInit{
  initiation: boolean = false
  cartItems: IUserCart = { success: true ,data: [] }
  totalPrice!: number

  constructor(private userService : UserService, private toastrService : ToastrService){}

  ngOnInit(): void {
    this.initiation = true
    this.userService.getUserCart().subscribe((res) => {
      this.cartItems = res
      if (this.cartItems.data.length === 0) {
        this.toastrService.info('Condider shopping for some and enjoy 😊', 'No Items')
        return
      }
      this.totalPrice = this.cartItems.data.reduce((acc, item) => acc + item.quantity * item.Food.price, 0);
    })
  }

  onAddQuantity(foodId: number) {
    this.userService.updateUserCart(foodId, 1).subscribe(() => {
      this.cartItems.data.map((item) => {
        if (item.foodId === foodId) {
          item.quantity += 1
          return item
        }
        return item
      })
    })
  }

  onReduceQuantity(foodId: number) {
    this.userService.updateUserCart(foodId, -1).subscribe(() => {
      this.cartItems.data.map((item) => {
        if (item.foodId === foodId) {
          item.quantity -= 1
          return item
        }
        return item
      })
    })
  }
}