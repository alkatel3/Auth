import { Component, inject, OnInit } from '@angular/core';
import { ResetPasswordRequest } from '../../interfaces/reset-password-request';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule],
  templateUrl: './reset-password.component.html',
  styleUrl: './reset-password.component.css'
})
export class ResetPasswordComponent implements OnInit {
  authService = inject(AuthService);
  router = inject(Router);
  route = inject(ActivatedRoute)
  matSnackBar = inject(MatSnackBar)
  resetPassword = {} as ResetPasswordRequest

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) =>{
      this.resetPassword.email = params['email']
      this.resetPassword.token = params['token']
    })
  }

  resetPasswordHandler(){
    this.authService.resetPassword(this.resetPassword).subscribe({
      next: (responce)=>{
            this.matSnackBar.open(responce.message, 'Close', {
            duration: 5000
          })

          this.router.navigate(['/login'])
      },
      error:(error: HttpErrorResponse) =>{
          this.matSnackBar.open(error.error.message, 'Close', {
            duration: 5000
          })
      }
    })
  }
}
