import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-change-password',
  imports: [FormsModule],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordComponent {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar);
  router = inject(Router)

  newPassword!: string;
  currentPassword!: string;
  
  changePassword() {
    this.authService.changePassword({
      email: this.authService.getUserDetail()?.email,
      newPassword: this.newPassword,
      currentPassword: this.currentPassword
    }).subscribe({
      next: (responce) => {
        if(responce.isSuccess){
          this.matSnackBar.open(responce.message, 'Close', {
            duration: 3000
          })
          this.authService.logout();
          this.router.navigate(['/login'])
        } else{
          this.matSnackBar.open(responce.message, 'Close', {
            duration: 3000
          })
        }
      },
      error:(error:HttpErrorResponse) => {
          this.matSnackBar.open(error.error.message, 'Close', {
            duration: 3000
          })
      }
    })
  }
}
