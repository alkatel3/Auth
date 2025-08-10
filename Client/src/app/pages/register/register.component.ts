import { Component, inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Router, RouterLink } from '@angular/router';
import { RoleService } from '../../services/role.service';
import { Observable } from 'rxjs';
import { Role } from '../../interfaces/role';
import { AsyncPipe, CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  imports: [MatInputModule, MatIconModule, MatSelectModule, RouterLink, ReactiveFormsModule, AsyncPipe, CommonModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit{
  fb = inject(FormBuilder)
  router = inject(Router)
  roleService = inject(RoleService)
  authService = inject(AuthService)
  matSnackbar = inject(MatSnackBar)

  roles$!: Observable<Role[]>;
  confirmPasswordHide:boolean = true
  passwordHide:boolean = true
  registerForm!: FormGroup
  unmappedErrors!: string[]
  
  ngOnInit(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      name: ['', [Validators.required]],
      surname: ['', [Validators.required]],
      roles: [''],
      confirmPassword: ['', Validators.required]
    },
    {
      validators: this.passworsMatchValidator
    })

    this.roles$ = this.roleService.getRoles()
  }

  register() {
    this.unmappedErrors = []
    this.authService.register(this.registerForm.value).subscribe({
      next: (response) => {
        console.log(response);
        this.matSnackbar.open(response.message, 'Close', {
          duration: 5000,
          horizontalPosition: 'center'
        })
        this.router.navigate(['/login'])
      },
      error: (error: HttpErrorResponse) => {
         if (error.status === 400) {
          const data = error.error;

          // Варіант 1: валідаційна модель { field: string[] }
          if (data && typeof data === 'object' && !Array.isArray(data) && 'errors' in data) {
            const v: Record<string, string[]> = data.errors;
            this.unmappedErrors = Object.entries(v)
              .flatMap(([f, msgs]) => msgs.map(m => `${f}: ${m}`));
          }
          // Варіант 2: масив помилок з code/description
          else if (Array.isArray(data)) {
            this.unmappedErrors = data.map(e => e.description ?? e.code ?? JSON.stringify(e));
          }
          // fallback
          else {
            this.unmappedErrors = ['Unknown error'];
          }
          this.matSnackbar.open('Validations error', 'Close', {
            duration: 5000,
            horizontalPosition: 'center'
          })
          }
        },
      complete: () => {
        console.log('Register success');
        
      },
    })
  }

  private passworsMatchValidator(control: AbstractControl):{[key: string]:boolean} | null{
    const password  =control.get('password')?.value
    const confirmPassword  =control.get('confirmPassword')?.value

    if(password != confirmPassword)
      return {'passwordMismatch' : true}

    return null
  }
}
