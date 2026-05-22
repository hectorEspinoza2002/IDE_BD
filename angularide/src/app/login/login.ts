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
  ) { }

  login() {
    this.errorMsg = '';

    this.http.post<any>('http://localhost:8080/api/login', {
      username: this.username,
      password: this.password
    }).subscribe({

      next: (res) => {

        if (res.success) {   // 🔥 validar

          localStorage.setItem('usuario', this.username);
          console.log(this.username);

          this.router.navigate(['/ide']);

        } else {

          this.errorMsg = res.message;

        }
      },

      error: () => {
        this.errorMsg = 'Error al conectar con el servidor';
      }

    });
  }

}
