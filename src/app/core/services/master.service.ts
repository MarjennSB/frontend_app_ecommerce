import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment.development';

export interface Departamento {
  id: number;
  descripcion: string;
}

export interface Provincia {
  id: number;
  descripcion: string;
  departamento_id: number;
}

export interface Distrito {
  id: number;
  descripcion: string;
  provincia_id: number;
}

export interface TipoDocumento {
  id: number;
  nombre: string;
  siglas: string;
  minimo: number;
  maximo: number;
}

export interface Genero {
  id: number;
  nombre: string;
}

@Injectable({
  providedIn: 'root'
})
export class MasterService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.apiUrl}/master`;

  getDepartamentos(): Observable<{ departamentos: Departamento[] }> {
    return this.http.get<{ departamentos: Departamento[] }>(`${this.baseUrl}/departamentos`);
  }

  getProvincias(): Observable<{ provincias: Provincia[] }> {
    return this.http.get<{ provincias: Provincia[] }>(`${this.baseUrl}/provincias`);
  }

  getDistritos(): Observable<{ distritos: Distrito[] }> {
    return this.http.get<{ distritos: Distrito[] }>(`${this.baseUrl}/distritos`);
  }

  getTiposDocumento(): Observable<{ tipodocumentoidentidad: TipoDocumento[] }> {
    return this.http.get<{ tipodocumentoidentidad: TipoDocumento[] }>(`${this.baseUrl}/tipos-documento-identidad`);
  }

  getGeneros(): Observable<{ generos: Genero[] }> {
    return this.http.get<{ generos: Genero[] }>(`${this.baseUrl}/generos`);
  }
}
