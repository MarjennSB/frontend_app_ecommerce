export interface UserRegistrationData {
  tipo_documento_identidad_id?: number | null;
  numero_documento?: string | null;
  nombres: string;
  apellido_paterno: string;
  apellido_materno?: string | null;
  numero_celular?: string | null;
  departamento_id?: number | null;
  provincia_id?: number | null;
  distrito_id?: number | null;
  fecha_nacimiento?: string | null;
  genero_id?: number | null;
  correo: string;
  password?: string;
  acepto_termino_condiciones?: boolean;
}

export interface UserLoginData {
  correo: string;
  password?: string;
}


export interface AuthResponse {
  mensaje: string;
  usuario: any;
  access_token: string;
  token_type: string;
  expires_in: number;
}