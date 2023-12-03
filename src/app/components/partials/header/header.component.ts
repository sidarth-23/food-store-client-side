import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { trigger, transition, style, animate, state } from '@angular/animations';
import { UserService } from '../../../services/user.service';
import { User } from '../../../shared/models/User';
import { IUserData } from '../../../shared/interfaces/users/response.interface';


@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './header.component.html',
  styles: ``,
  animations: [
    trigger('fadeInOut', [
      state('open', style({ opacity: 1, display: 'block' })),
      state('closed', style({ opacity: 0, display: 'none' })),
      transition('closed => open', [
        style({ opacity: 0 }),
        animate('300ms ease-in-out'),
      ]),
      transition('open => closed', [
        animate('300ms ease-in-out', style({ opacity: 0 })),
      ]),
    ]),
  ],
})
export class HeaderComponent implements OnInit{
  authState: boolean = false
  headTrigger: 'open' | 'closed' = 'closed';
  userData!: IUserData
  constructor(private router: Router, private userService: UserService ){
    this.userService.userObservable.subscribe((user) => {
      this.userData = user;
      if (this.userData.token) {
        this.authState = true
      }
    });
  }

  ngOnInit(): void {
      const urlLink = this.router.url
  }
  @HostListener('document:click', ['$event'])
  clickOutsidePanel(event: Event) {
    const target = event.target as HTMLElement;

    if (!target.closest('.username-btn')) {
      this.headTrigger = 'closed';
    }
  }

  headClick() {
      this.headTrigger = this.headTrigger === 'open' ? 'closed' : 'open';
  }


  logout() {
    this.userService.logout();
    this.authState = false
  }
}
