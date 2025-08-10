import { Component, inject, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input'
import { MatIconModule } from '@angular/material/icon'
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'

@Component({
  selector: 'app-login',
  imports: [MatInputModule, MatIconModule, MatSnackBarModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  authService = inject(AuthService)
  matSnackBar = inject(MatSnackBar)
  router = inject(Router)
  hide = true;
  form!: FormGroup 
  fb = inject(FormBuilder)
  
  ngOnInit(): void {
    this.form = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password : ['', [Validators.required]]
    })
  }

  login() {
    this.authService.login(this.form.value).subscribe({
      next: (responce) => {
        this.matSnackBar.open(responce.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        })
        this.router.navigate(['/'])
      },
      error: (error) => {
        this.matSnackBar.open(error.error.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        })
      }
    })
  }
}
