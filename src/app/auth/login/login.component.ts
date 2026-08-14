import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  loginForm!: FormGroup;
  apiError = signal<string | null>(null);
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      correo: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.apiError.set(null);

    this.authService.login(this.loginForm.value).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.authService.setToken(res.access_token);
        this.authService.setUser(res.usuario);
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 401) {
          this.apiError.set('Credenciales incorrectas');
        } else {
          this.apiError.set('Ocurrió un error al intentar iniciar sesión.');
        }
      }
    });
  }
}
