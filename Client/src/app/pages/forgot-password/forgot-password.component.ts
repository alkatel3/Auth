import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-forgot-password',
  imports: [FormsModule, MatIcon],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  authService = inject(AuthService);
  matSnackBar = inject(MatSnackBar)
  showEmailSent = false;
  isSubmitting = false
  email!: string;

  forgotPassword(){
    this.isSubmitting = true
    this.authService.forgotPassword(this.email).subscribe({
      next:(responce) =>{
        if(responce.isSuccess){
          this.matSnackBar.open(responce.message, 'Close', {
            duration: 5000
          })
          this.showEmailSent = true;
        } else {
          this.matSnackBar.open(responce.message, 'Close', {
            duration: 5000
          })
        }
      },
      error:(error: HttpErrorResponse) =>{
          this.matSnackBar.open(error.message, 'Close', {
            duration: 5000
          })
      },
      complete: () => {
        this.isSubmitting = false
      }
    })
  }
}
