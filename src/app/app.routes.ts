import { Routes } from '@angular/router';
import { LoginPageComponent } from './components/pages/login-page/login-page.component';
import { RegisterPageComponent } from './components/pages/register-page/register-page.component';
import { HomePageComponent } from './components/pages/home-page/home-page.component';
import { CartPageComponent } from './components/pages/cart-page/cart-page.component';
import { CheckoutPageComponent } from './components/pages/checkout-page/checkout-page.component';
import { SummaryPageComponent } from './components/pages/summary-page/summary-page.component';
import { ProfilePageComponent } from './components/pages/profile-page/profile-page.component';
import { OrderPageComponent } from './components/pages/order-page/order-page.component';
import { authGuard } from './shared/auth/auth.guard';
import { isLoginGuard } from './shared/auth/is-login.guard';

export const routes: Routes = [
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: 'login', component: LoginPageComponent, canActivate: [isLoginGuard] },
  { path: 'register', component: RegisterPageComponent, canActivate: [isLoginGuard] },
  { path: 'home', component: HomePageComponent },
  { path: 'home/favourites', component: HomePageComponent, canActivate: [authGuard] },
  { path: 'home/tag/:tagName', component: HomePageComponent },
  { path: 'home/search/:searchTerm', component: HomePageComponent },
  { path: 'cart', component: CartPageComponent, canActivate: [authGuard] },
  { path: 'checkout', component: CheckoutPageComponent, canActivate: [authGuard] },
  { path: 'order-summary', component: SummaryPageComponent, canActivate: [authGuard] },
  { path: 'profile/:update', component: ProfilePageComponent, canActivate: [authGuard] },
  { path: 'orders', component: OrderPageComponent, canActivate: [authGuard] },
];
