import { Component, OnInit } from '@angular/core';
import { CommonModule, NgClass } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { PasswordStrengthValidator } from '../../../shared/validators/password-strenght.validator';
import { trigger, transition, style, animate } from '@angular/animations';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, ReactiveFormsModule, NgClass],
  templateUrl: './login-page.component.html',
  styles: ``
})
export class LoginPageComponent implements OnInit{
  loginForm!: FormGroup;

  constructor(private formBuilder: FormBuilder, private userService : UserService, private router : Router){}

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), PasswordStrengthValidator()]],
    });
  }

  get fc() {
    return this.loginForm.controls;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      return;
    }
    this.userService
      .login({
        email: this.fc['email'].value,
        password: this.fc['password'].value,
      })
      .subscribe((res) => {
        this.router.navigateByUrl('/home');
      });
  }
}
