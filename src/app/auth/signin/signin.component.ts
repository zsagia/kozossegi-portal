import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UserLoginData } from 'src/app/shared/models/user-login.model';
import { AuthService } from 'src/app/shared/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  signInForm!: FormGroup;
  errorMessage: string = '';

  constructor(private authService: AuthService,
              private fb: FormBuilder,
              private router: Router) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.signInForm = this.fb.group({
      email: ['admin@b.c', [Validators.required, Validators.email]],
      password: ['123', Validators.required],
    });
  }

  signIn(): void {
    if (this.signInForm.valid) {
      const user: UserLoginData = {
        email: this.signInForm.value.email,
        password: this.signInForm.value.password
      };
      this.authService.signIn(user).subscribe(response => {
        if (response.success) {
          this.router.navigate(['/newsfeed']);
        } else {
          this.errorMessage = response.message;
        }
      });
    }
  }
}
