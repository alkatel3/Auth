import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { AsyncPipe, CommonModule } from '@angular/common';

@Component({
  selector: 'app-account',
  imports: [AsyncPipe, CommonModule],
  templateUrl: './account.component.html',
  styleUrl: './account.component.css'
})
export class AccountComponent {
  authService = inject(AuthService)
  accountDetail$ = this.authService.getDetail();
}
