import { UserLoginData } from 'src/app/shared/models/user-login.model';

import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthUtilService } from '../service/auth-util.service';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss'],
})
export class SigninComponent implements OnInit {
  public errorMessage: string = '';
  signInForm!: FormGroup;

  constructor(
    private authUtilService: AuthUtilService,
    private fb: FormBuilder,
    private router: Router
  ) {}

  public initForm(): void {
    this.signInForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  public ngOnInit(): void {
    this.initForm();
  }

  public signIn(): void {
    if (this.signInForm.valid) {
      const user: UserLoginData = {
        email: this.signInForm.value.email,
        password: this.signInForm.value.password,
      };
      this.authUtilService.signIn(user).subscribe((response) => {
        if (response.success) {
          this.router.navigate(['/newsfeed']);
        } else {
          this.errorMessage = response.message;
        }
      });
    }
  }
}
