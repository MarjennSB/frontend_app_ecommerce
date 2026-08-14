import { Component, inject, OnInit, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { Departamento, Distrito, Genero, MasterService, Provincia, TipoDocumento } from '../../core/services/master.service';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private masterService = inject(MasterService);
  private router = inject(Router);

  signupForm!: FormGroup;

  tiposDocumento = signal<TipoDocumento[]>([]);
  generos = signal<Genero[]>([]);
  departamentos = signal<Departamento[]>([]);
  
  allProvincias: Provincia[] = [];
  allDistritos: Distrito[] = [];

  provinciasFiltradas = signal<Provincia[]>([]);
  distritosFiltrados = signal<Distrito[]>([]);

  documentMaxLength = signal<number | null>(null);

  apiErrors = signal<any>({});
  isSubmitting = signal(false);

  ngOnInit(): void {
    this.initForm();
    this.loadMasters();
    this.setupFilters();
  }

  private initForm(): void {
    this.signupForm = this.fb.group({
      nombres: ['', [Validators.required, Validators.maxLength(150)]],
      apellido_paterno: ['', [Validators.required, Validators.maxLength(100)]],
      apellido_materno: ['', [Validators.maxLength(100)]],
      correo: ['', [Validators.required, Validators.email, Validators.maxLength(150)]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      tipo_documento_identidad_id: [null],
      numero_documento: [{ value: '', disabled: true }, [Validators.maxLength(20)]],
      numero_celular: ['', [Validators.maxLength(20)]],
      fecha_nacimiento: [null],
      genero_id: [null],
      departamento_id: [null],
      provincia_id: [null],
      distrito_id: [null],
      acepto_termino_condiciones: [false, Validators.requiredTrue]
    });
  }

  private loadMasters(): void {
    this.masterService.getTiposDocumento().subscribe(res => this.tiposDocumento.set(res.tipodocumentoidentidad));
    this.masterService.getGeneros().subscribe(res => this.generos.set(res.generos));
    this.masterService.getDepartamentos().subscribe(res => this.departamentos.set(res.departamentos));
    this.masterService.getProvincias().subscribe(res => this.allProvincias = res.provincias);
    this.masterService.getDistritos().subscribe(res => this.allDistritos = res.distritos);
  }

  private setupFilters(): void {
    this.signupForm.get('departamento_id')?.valueChanges.subscribe(depId => {
      this.signupForm.patchValue({ provincia_id: null, distrito_id: null }, { emitEvent: false });
      this.distritosFiltrados.set([]);
      if (depId) {
        this.provinciasFiltradas.set(this.allProvincias.filter(p => p.departamento_id == depId));
      } else {
        this.provinciasFiltradas.set([]);
      }
    });

    this.signupForm.get('provincia_id')?.valueChanges.subscribe(provId => {
      this.signupForm.patchValue({ distrito_id: null }, { emitEvent: false });
      if (provId) {
        this.distritosFiltrados.set(this.allDistritos.filter(d => d.provincia_id == provId));
      } else {
        this.distritosFiltrados.set([]);
      }
    });

    this.signupForm.get('tipo_documento_identidad_id')?.valueChanges.subscribe(tipoId => {
      const numDocControl = this.signupForm.get('numero_documento');
      if (tipoId) {
        const tipo = this.tiposDocumento().find(t => t.id == tipoId);
        if (tipo) {
          this.documentMaxLength.set(tipo.maximo);
          numDocControl?.enable();
        } else {
          this.documentMaxLength.set(null);
          numDocControl?.disable();
          numDocControl?.setValue('');
        }
      } else {
        this.documentMaxLength.set(null);
        numDocControl?.disable();
        numDocControl?.setValue('');
      }
    });
  }

  onSubmit(): void {
    if (this.signupForm.invalid) {
      this.signupForm.markAllAsTouched();
      return;
    }

    this.isSubmitting.set(true);
    this.apiErrors.set({});

    this.authService.register(this.signupForm.value).subscribe({
      next: (res) => {
        this.isSubmitting.set(false);
        this.authService.setToken(res.access_token);
        this.authService.setUser(res.usuario);
        // User asked to redirect to '/'
        this.router.navigate(['/']);
      },
      error: (err) => {
        this.isSubmitting.set(false);
        if (err.status === 422 && err.error?.errors) {
          this.apiErrors.set(err.error.errors);
        } else {
          alert('Hubo un error al registrar el usuario.');
        }
      }
    });
  }
}
