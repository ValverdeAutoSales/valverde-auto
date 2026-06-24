import { Component, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, ReactiveFormsModule, Validators, AbstractControl, ValidationErrors } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { MessageModule } from 'primeng/message';
import { AuthService } from '../../../core/services/auth.service';
import { I18nService } from '../../../core/services/i18n.service';

type ViewMode = 'login' | 'register';

function passwordMatch(control: AbstractControl): ValidationErrors | null {
  const pw  = control.get('password')?.value;
  const cpw = control.get('confirmPassword')?.value;
  return pw && cpw && pw !== cpw ? { mismatch: true } : null;
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, ButtonModule, InputTextModule, PasswordModule, MessageModule],
  templateUrl: './login.component.html'
})
export class LoginComponent {
  private readonly fb     = inject(FormBuilder);
  private readonly auth   = inject(AuthService);
  private readonly router = inject(Router);
  readonly i18n           = inject(I18nService);

  readonly view    = signal<ViewMode>('login');
  readonly loading = signal(false);
  readonly error   = signal<string | null>(null);

  // Formulario de LOGIN
  readonly loginForm = this.fb.nonNullable.group({
    email:    ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(4)]]
  });

  // Formulario de REGISTRO
  readonly registerForm = this.fb.nonNullable.group({
    name:            ['', [Validators.required, Validators.minLength(2)]],
    email:           ['', [Validators.required, Validators.email]],
    password:        ['', [Validators.required, Validators.minLength(4)]],
    confirmPassword: ['', Validators.required]
  }, { validators: passwordMatch });

  switchTo(mode: ViewMode): void {
    this.view.set(mode);
    this.error.set(null);
    this.loginForm.reset();
    this.registerForm.reset();
  }

  async submitLogin(): Promise<void> {
    if (this.loginForm.invalid) { 
      this.loginForm.markAllAsTouched(); 
      return; 
    }
    
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const { email, password } = this.loginForm.getRawValue();
      
      // Ya no pasamos role, el backend lo determina
      const user = await this.auth.login({ email, password });
      
      // Navegar según el rol que devuelve el backend
      this.router.navigate([user.role === 'admin' ? '/admin' : '/']);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Error inesperado.');
    } finally {
      this.loading.set(false);
    }
  }

  async submitRegister(): Promise<void> {
    if (this.registerForm.invalid) { 
      this.registerForm.markAllAsTouched(); 
      return; 
    }
    
    this.loading.set(true);
    this.error.set(null);
    
    try {
      const { name, email, password } = this.registerForm.getRawValue();
      const user = await this.auth.register(name, email, password);
      this.router.navigate(['/']);
    } catch (e) {
      this.error.set(e instanceof Error ? e.message : 'Error inesperado.');
    } finally {
      this.loading.set(false);
    }
  }

  get lEmail()    { return this.loginForm.controls.email;    }
  get lPassword() { return this.loginForm.controls.password; }
  get rName()     { return this.registerForm.controls.name;  }
  get rEmail()    { return this.registerForm.controls.email; }
  get rPassword() { return this.registerForm.controls.password; }
  get rConfirm()  { return this.registerForm.controls.confirmPassword; }
  get rMismatch() { return this.registerForm.hasError('mismatch') && this.rConfirm.touched; }
}