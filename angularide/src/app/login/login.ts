import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {

  username = '';
  password = '';

  errorMsg = '';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(){

  this.errorMsg = '';

  this.http.post('http://localhost:8080/auth/login',{
    username: this.username,
    password: this.password
  }).subscribe({

    next:(res:any) => {

      localStorage.setItem('usuario', JSON.stringify(res));

      this.router.navigate(['/ide']);
    },

    error: () => {
      this.errorMsg = 'Credenciales incorrectas';
    }

  });

  }

}
