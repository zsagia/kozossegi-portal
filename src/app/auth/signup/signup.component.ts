import { UserRegData } from 'src/app/shared/models/user-reg.model';

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthUtilService } from '../service/auth-util.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent {
  public email: string = '';
  public errorMessage: string = '';
  public name: string = '';
  public password: string = '';
  @ViewChild('signupForm') signupForm!: NgForm;

  constructor(
    private authUtilService: AuthUtilService,
    private router: Router
  ) {}

  public signup(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const newUser: UserRegData = {
      name: form.value.name,
      email: form.value.email,
      password: form.value.password,
    };
    this.authUtilService.signUp(newUser).subscribe({
      next: () => this.router.navigate(['/signin']),
      error: (errorMessage) => {
        this.errorMessage = errorMessage;
      },
    });
  }
}
