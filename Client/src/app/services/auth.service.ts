import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { LoginRequest } from '../interfaces/login-request';
import { map, Observable } from 'rxjs';
import { AuthResponse } from '../interfaces/auth-response';
import { HttpClient } from '@angular/common/http';
import { jwtDecode } from 'jwt-decode';
import { RegisterRequest } from '../interfaces/register-request';
import { UserDetail } from '../interfaces/user-detail';
import { ResetPasswordRequest } from '../interfaces/reset-password-request';
import { ChangePasswordRequest } from '../interfaces/change-password-request';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl:string = environment.apiUrl
  private userKey = 'user'

  constructor(private httpClient: HttpClient) { }

  login(data: LoginRequest) : Observable<AuthResponse>{
    return this.httpClient
      .post<AuthResponse>(`${this.apiUrl}account/login`, data)
      .pipe(
        map((response: AuthResponse) => {
          if(response.isSuccess){
            localStorage.setItem(this.userKey, JSON.stringify(response));
          }

          return response
        })
    )
  }

  getUserDetail(){
    const token = this.getToken();
    if(!token) 
      return null;
    
    const decoded: any = jwtDecode(token)
    const userDetail = {
      id: decoded.nameid,
      fullName: decoded.name,
      email: decoded.email,
      roles: decoded.role || [],
    }

    return userDetail;
  }

  isLoggedIn(): boolean {
    const token = this.getToken()
    if(!token)
      return false

    return true//!this.isTokenExpired()
  }

  private isTokenExpired() {
    const token = this.getToken();

    if(!token) 
      return true;

    const decoded = jwtDecode(token)
    const isTokenExpired = Date.now() >= decoded['exp']! * 1000
    if(isTokenExpired)
       this.logout()

    return true//isTokenExpired
  }

  logout() {
    localStorage.removeItem(this.userKey)
  }

  getToken = (): string | null => {
    const user = localStorage.getItem(this.userKey);
    if(!user)
      return null
    
    const userDetail: AuthResponse = JSON.parse(user)
    return userDetail.token
  }

  getRefreshToken = (): string | null => {
    const user = localStorage.getItem(this.userKey);
    if(!user)
      return null
    
    const userDetail: AuthResponse = JSON.parse(user)
    return userDetail.refreshToken
  }

  register(data: RegisterRequest): Observable<AuthResponse> {
    return this.httpClient
      .post<AuthResponse>(`${this.apiUrl}account/register`, data)
  }

  getDetail(): Observable<UserDetail>{
    return this.httpClient.get<UserDetail>(`${this.apiUrl}account/detail`)
  }

  getAll(): Observable<UserDetail[]>{
    return this.httpClient.get<UserDetail[]>(`${this.apiUrl}account`)
  }

  forgotPassword(email: string): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}account/forgot-password`, { email: email })
  }

  resetPassword(data: ResetPasswordRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}account/reset-password`, data)
  }

  changePassword(data: ChangePasswordRequest): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}account/change-password`, data)
  }
  
  refreshToken(data: {email: string, token: string, refreshToken: string}): Observable<AuthResponse> {
    return this.httpClient.post<AuthResponse>(`${this.apiUrl}account/refresh-token`, data)
  }

  getRoles():string[] | null {
    const token = this.getToken();
    if(!token)
      return null;

    const decodedToken:any = jwtDecode(token);
    return decodedToken.role || null
  }
}
