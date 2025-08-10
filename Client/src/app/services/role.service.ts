import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Role } from '../interfaces/role';

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
}
