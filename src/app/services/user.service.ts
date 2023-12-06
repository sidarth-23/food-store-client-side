import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import {
  IPassChange,
  IUserLogin,
  IUserRegisterOrUpdate,
} from '../shared/interfaces/users/requests.interface';
import {
  GET_AND_PATCH_LOGGED_IN_USER_DATA,
  GET_AND_PATCH_USER_CART,
  GET_AND_PATCH_USER_FAVOURITES,
  GET_USER_ADDRESS,
  PATCH_PASSWORD,
  POST_LOGIN_USER,
  POST_REGISTER_USER,
} from '../shared/constants/urls';
import { Address, User } from '../shared/models/User';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import {
  IUserData,
  IGetUser,
  IUserCart,
  IUserFavourites,
  IUserRes,
  ErrorMessage,
} from '../shared/interfaces/users/response.interface';
import { Router } from '@angular/router';

const USER_KEY = 'User';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private userSubject = new BehaviorSubject<IUserData>(new IUserData());
  public userObservable: Observable<IUserData>;

  constructor(
    private http: HttpClient,
    private toastrService: ToastrService,
    private router: Router
  ) {
    this.userObservable = this.userSubject.asObservable();

    const initialUser = this.GetUserFromLocalStorage();
    if (initialUser.token) {
      this.userSubject.next(initialUser);
    }
  }

  public get currentUser(): IUserData {
    return this.userSubject.value;
  }

  getUser(): Observable<IGetUser> {
    return this.http.get<IGetUser>(GET_AND_PATCH_LOGGED_IN_USER_DATA);
  }

  getFavourites(): Observable<IUserFavourites> {
    return this.http.get<IUserFavourites>(GET_AND_PATCH_USER_FAVOURITES);
  }

  getUserAddress(): Observable<Address> {
    return this.http.get<Address>(GET_USER_ADDRESS);
  }

  getUserCart(): Observable<IUserCart> {
    return this.http.get<IUserCart>(GET_AND_PATCH_USER_CART);
  }

  login(userLogin: IUserLogin) {
    return this.http.post<IUserRes>(POST_LOGIN_USER, userLogin).pipe(
      tap({
        next: (user) => {
          console.log(user);
          this.setUserAndNotify(user);
          this.toastrService.success(
            `Welcome back, ${user.data.firstName} ${user.data.lastName}`,
            'Welcome to Foodmine'
          );
        },
        error: (err) => {
          err.error.errMessage.forEach((item: ErrorMessage) => {
            this.toastrService.error(item.msg, 'Login Failed');
          });
        },
      })
    );
  }

  logout() {
    localStorage.removeItem(USER_KEY);
    this.toastrService.success(
      `Have a great day ${this.currentUser.firstName} ${this.currentUser.lastName}, see you soon`,
      'Logout Successful'
    );
    this.userSubject.next(new IUserData());
    this.router.navigateByUrl('/login');
  }

  register(userRegister: IUserRegisterOrUpdate): Observable<IUserRes> {
    return this.http.post<IUserRes>(POST_REGISTER_USER, userRegister).pipe(
      tap({
        next: (user) => {
          this.setUserAndNotify(user);
          this.toastrService.success(
            `Welcome to Foodmine ${user.data.firstName} ${user.data.lastName}`,
            'Register Successful'
          );
        },
        error: (err) => {
          err.error.errors.forEach((item: ErrorMessage) => {
            this.toastrService.error(item.msg, 'Registration Failed');
          });
        },
      })
    );
  }

  updateUser(userUpdate: IUserRegisterOrUpdate): Observable<IUserRes> {
    return this.http
      .patch<IUserRes>(GET_AND_PATCH_LOGGED_IN_USER_DATA, userUpdate)
      .pipe(
        tap({
          next: (updatedUser) => {
            this.setUserAndNotify(updatedUser);
            this.toastrService.success(
              'User updated successfully. Continue with your search'
            );
          },
          error: (err) => {
            err.error.errors.forEach((item: ErrorMessage) => {
              this.toastrService.error(item.msg, 'Updating User Details Failed');
            });
          },
        })
      );
  }

  updatePass(userLogin: IPassChange): Observable<IUserRes> {
    return this.http.patch<IUserRes>(PATCH_PASSWORD, userLogin).pipe(
      tap({
        next: (updatedUser) => {
          this.setUserAndNotify(updatedUser);
          this.toastrService.success(
            'Password updated successfully. Continue with your shopping'
          );
        },
        error: (err) => {
          this.toastrService.error(
            err.error.errMessage,
            'Password update failed'
          );
        },
      })
    );
  }

  toggleFavourite(foodId: number): Observable<IUserFavourites> {
    return this.http
      .patch<IUserFavourites>(GET_AND_PATCH_USER_FAVOURITES, { foodId })
      .pipe(
        tap({
          next: (favourite) => {
            const presenceCheck = favourite.message.map(
              (fav) => fav.Food.id === foodId
            );
            const message = presenceCheck.includes(true)
              ? 'Added to favourites'
              : 'Removed from favourites';
            this.toastrService.success(message);
          },
          error: (err) => {
            this.toastrService.error(err.errMessage, 'Favourite toggle failed');
          },
        })
      );
  }

  updateUserCart(
    foodId: number,
    quantity: number,
    isRemove: boolean = false
  ): Observable<{ success: boolean; data: string }> {
    return this.http
      .patch<{ success: boolean; data: string }>(GET_AND_PATCH_USER_CART, {
        foodId,
        quantity,
      })
      .pipe(
        tap({
          next: (cart) => {
            if (!isRemove)
              return this.toastrService.success(
                cart.data,
                'Cart update successful'
              );
            return this.toastrService.success(
              cart.data,
              'Cart item removed successful'
            );
          },
          error: (err) => {
            this.toastrService.error(err.errMessage, 'Cart update failed');
          },
        })
      );
  }

  private setUserAndNotify(updatedUser: IUserRes) {
    this.setUserToLocalStorage(updatedUser.data);
    if (updatedUser.data.token) {
      this.userSubject.next(updatedUser.data);
    }
  }

  private setUserToLocalStorage(user: IUserData) {
    const currentUsers = { ...this.userSubject.value };
    const updatedUser = { ...currentUsers, ...user };
    localStorage.setItem(USER_KEY, JSON.stringify(updatedUser));
    this.userSubject.next(updatedUser);
  }

  private GetUserFromLocalStorage(): IUserData {
    const userJson = localStorage.getItem(USER_KEY);
    const user = userJson
      ? (JSON.parse(userJson) as IUserData)
      : new IUserData();
    this.userSubject.next(user);
    return user;
  }
}
