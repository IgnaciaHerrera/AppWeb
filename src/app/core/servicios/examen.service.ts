import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Resultado {
  nombre: string;
  valor: string;
  unidad: string;
  rangoReferencia: string;
  estado: string;
}

export interface Examen {
  id: number;
  nombre: string;
  tipo: string;
  fecha: string;
  medico: string;
  expanded: boolean;
  resultados: Resultado[];
}

@Injectable({ providedIn: 'root' })
export class ExamenesService {
  private http = inject(HttpClient);
  private base = environment.servicios.examenes;

  listar(): Observable<Examen[]> {
    return this.http.get<Examen[]>(`${this.base}/examenes`);
  }

  obtener(id: number): Observable<Examen> {
    return this.http.get<Examen>(`${this.base}/examenes/${id}`);
  }
}
