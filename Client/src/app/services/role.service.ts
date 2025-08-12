import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/role';
import { RoleCreateRequest } from '../interfaces/role-create-request';

@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private apiUrl =environment.apiUrl;

  constructor(
    private httpClient: HttpClient
  ) { }

  getRoles(): Observable<Role[]>{
    return this.httpClient.get<Role[]>(`${this.apiUrl}roles`)
  }
  
  createRole(role: RoleCreateRequest): Observable<{message: string}> {
    return this.httpClient.post<{message: string}>(`${this.apiUrl}Roles`, role)
  }
  
  deleteRole(id: string): Observable<{message: string}> {
    return this.httpClient.delete<{message: string}>(`${this.apiUrl}roles/${id}`)
  }
  
  assignRole(userId: string, roleId: string): Observable<{message: string}> {
    return this.httpClient.post<{message: string}>(`${this.apiUrl}roles/assign`, {
      userId,
      roleId
    })
  }
}
