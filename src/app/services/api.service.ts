import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private baseUrl = '/api';

  constructor(private http: HttpClient) {}

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('GET request to:', url);
    
    try {
      const response = await firstValueFrom(this.http.get<T>(url));
      console.log('GET response received:', response);
      return response;
    } catch (error: any) {
      console.error('GET error details:');
      console.error('- Full error object:', error);
      console.error('- Status:', error.status);
      console.error('- StatusText:', error.statusText);
      console.error('- Error message:', error.message);
      console.error('- URL:', error.url);
      
      if (error.status === 0) {
        console.error('CORS ERROR: El navegador bloqueó la petición');
        console.error('Esto significa que el servidor no tiene configurado CORS correctamente');
      }
      
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('POST request to:', url);
    console.log('POST data:', data);
    
    try {
      const response = await firstValueFrom(
        this.http.post<T>(url, data, {
          headers: {
            'Content-Type': 'application/json'
          }
        })
      );
      console.log('POST response received:', response);
      return response;
    } catch (error: any) {
      console.error('POST error details:');
      console.error('- Full error object:', error);
      console.error('- Status:', error.status);
      console.error('- StatusText:', error.statusText);
      console.error('- Error message:', error.message);
      console.error('- URL:', error.url);
      
      if (error.status === 0) {
        console.error('CORS ERROR: El navegador bloqueó la petición');
        console.error('Esto significa que el servidor no tiene configurado CORS correctamente');
      }
      
      throw error;
    }
  }
}
