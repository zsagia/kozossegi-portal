import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm } from "@angular/forms";
import { AuthService } from '../../shared/services/auth.service';
import { UserRegData } from 'src/app/shared/models/user-reg.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  @ViewChild('signupForm') signupForm!: NgForm;
  name: string = 'qwe';
  email: string = 'gg@gg.hu';
  password: string = '123';
  errorMessage: string = '';

  constructor(private authService: AuthService,
              private router: Router) {}

  signup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const newUser: UserRegData = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password
    };
    this.authService.signUp(newUser).subscribe({
      next: user => {
        console.log(user);
        this.router.navigate(['/signin']);
      },
      error: errorMessage => {
        console.log(errorMessage);
        this.errorMessage = errorMessage;
      }
    });

  }
}
