import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { GET_USER_ORDERS, POST_USER_ORDER } from '../shared/constants/urls';
import { IUserCreateOrder, IUserOrders, OrderSummary } from '../shared/interfaces/users/response.interface';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { ICreateOrder } from '../shared/interfaces/users/requests.interface';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private toastrService: ToastrService) {}

  getOrders() {
    return this.http.get<OrderSummary[]>(GET_USER_ORDERS).pipe(tap({
      error: (err) => {
        this.toastrService.warning(err.error.errMessage, 'No Items Found')
      }
    }));
  }

  createUserOrder(orderData: ICreateOrder) {
    return this.http.post<IUserCreateOrder>(POST_USER_ORDER, orderData).pipe(
      tap({
        next: (newOrder) => {
          console.log('success', newOrder)
          this.toastrService.success(
            `Order created successfully with id ${newOrder.id}. Delight is waiting`, 'Hurray! Complete the payment'
          );
        },
        error: (err) => {
          console.log('fail', err)
          this.toastrService.error(err.error.errMessage, 'Order creation failed');
        },
      })
    );
  }
}
