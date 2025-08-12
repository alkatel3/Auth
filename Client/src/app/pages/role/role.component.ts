import { Component, inject } from '@angular/core';
import { RoleFormComponent } from "../../components/role-form/role-form.component";
import { RoleService } from '../../services/role.service';
import { RoleCreateRequest } from '../../interfaces/role-create-request';
import { MatSnackBar } from '@angular/material/snack-bar';
import { RoleListComponent } from "../../components/role-list/role-list.component";
import { AsyncPipe } from '@angular/common';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-role',
  imports: [RoleFormComponent, RoleListComponent, MatInputModule, AsyncPipe, MatSelectModule],
  templateUrl: './role.component.html',
  styleUrl: './role.component.css'
})
export class RoleComponent {
  roleService = inject(RoleService);
  authService = inject(AuthService);
  stackBar = inject(MatSnackBar)
  errorMessage = ''
  role: RoleCreateRequest = {} as RoleCreateRequest
  roles$ = this.roleService.getRoles()
  users$ = this.authService.getAll()
  selectedUser: string = ''
  selectedRole: string = ''

  createRole(role: RoleCreateRequest){
    this.roleService.createRole(role).subscribe({
      next:(response: {message: string}) => {
        this.roles$ = this.roleService.getRoles()
        this.stackBar.open('Role Created Successfully', "Ok", {
          duration: 3000
        })
      },
      error:(error) => {
        if(error.status == 400){
          this.errorMessage = error.error.message
        }
      }
    })
  }

  deleteRole(id: string) {
    this.roleService.deleteRole(id).subscribe({
      next:(response: {message: string}) => {
        this.roles$ = this.roleService.getRoles()
        this.stackBar.open('Role Delete Successfully', "Ok", {
          duration: 3000
        })
      },
      error:(error) => {
        if(error.status == 400){
          this.errorMessage = error.error.message
        }
      }
    })
  }

  assignRole() {
    this.roleService.assignRole(this.selectedUser, this.selectedRole).subscribe({
      next:() => {
        this.roles$ = this.roleService.getRoles()
        this.stackBar.open('Role Delete Successfully', "Ok", {
          duration: 3000
        })
      },
      error:(error) => {
        if(error.status == 400){
          this.errorMessage = error.error.message
        }
      }
    })
  }
}
