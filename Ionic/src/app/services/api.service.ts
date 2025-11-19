import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

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
      // request response as text to avoid JSON parse errors if backend returns plain text/204
      const httpResponse: any = await firstValueFrom(
        this.http.post(url, data, { headers: { 'Content-Type': 'application/json' }, observe: 'response', responseType: 'text' as 'json' }) as any
      );

      console.log('POST raw response status:', httpResponse.status);
      console.log('POST raw response body:', httpResponse.body);

      const bodyText = httpResponse.body;
      if (!bodyText) return null as any;
      try {
        return JSON.parse(bodyText);
      } catch {
        return bodyText;
      }
    } catch (error: any) {
      console.error('POST error details:');
      console.error('- Full error object:', error);
      console.error('- Status:', error.status);
      console.error('- StatusText:', error.statusText);
      console.error('- Error message:', error.message);
      console.error('- URL:', error.url);
      
      // Detect proxy-miss where dev server returns HTML like "Cannot POST /api/alergias"
      const bodyText = error?.error || error?.message || '';
      if (typeof bodyText === 'string' && /Cannot\s+POST\s+\/api/i.test(bodyText)) {
        console.warn('Detected proxy-miss HTML 404 for POST, retrying directly against API Gateway...');
        try {
          const directPath = endpoint.replace(/^\/api/, '');
          const altUrl = `${environment.apiGateway}${directPath}`;
          console.log('Retry POST direct to:', altUrl);
          const altResp: any = await firstValueFrom(
            this.http.post(altUrl, data, { headers: { 'Content-Type': 'application/json' }, observe: 'response', responseType: 'text' as 'json' }) as any
          );
          const altBody = altResp?.body;
          try { return JSON.parse(altBody); } catch { return altBody; }
        } catch (altErr) {
          console.error('Direct POST retry failed:', altErr);
        }
      }

      if (error.status === 0) {
        console.error('CORS ERROR: El navegador bloqueó la petición');
        console.error('Esto significa que el servidor no tiene configurado CORS correctamente');
      }

      throw error;
    }
  }

  async delete<T>(endpoint: string): Promise<T | any> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('DELETE request to:', url);

    try {
      // Use observe: 'response' and responseType: 'text' to avoid JSON parse errors
      const httpResponse: any = await firstValueFrom(
        this.http.delete(url, { observe: 'response', responseType: 'text' as 'json' }) as any
      );

      console.log('DELETE raw response status:', httpResponse.status);
      console.log('DELETE raw response body:', httpResponse.body);

      // Try to parse body as JSON, otherwise return raw text
      const bodyText = httpResponse.body;
      if (!bodyText) return null as any;

      try {
        return JSON.parse(bodyText);
      } catch (_parseErr) {
        return bodyText;
      }
    } catch (error: any) {
      console.error('DELETE error details:');
      console.error('- Full error object:', error);
      console.error('- Status:', error?.status);
      console.error('- StatusText:', error?.statusText);
      console.error('- Error message:', error?.message);
      console.error('- URL:', error?.url || url);

      // Detect common case where dev server handled the request (proxy not applied)
      // and returned an HTML 404 like: "Cannot DELETE /api/alergias/2"
      const bodyText = error?.error || error?.message || '';
      if (typeof bodyText === 'string' && /Cannot\s+DELETE\s+\/api/i.test(bodyText)) {
        console.warn('Detected proxy-miss HTML 404 response, retrying directly against API Gateway...');
        try {
          const directPath = endpoint.replace(/^\/api/, '');
          const altUrl = `${environment.apiGateway}${directPath}`;
          console.log('Retry DELETE direct to:', altUrl);
          const altResp: any = await firstValueFrom(
            this.http.delete(altUrl, { observe: 'response', responseType: 'text' as 'json' }) as any
          );
          const altBody = altResp?.body;
          try { return JSON.parse(altBody); } catch { return altBody; }
        } catch (altErr) {
          console.error('Direct DELETE retry failed:', altErr);
        }
      }

      if (error?.status === 0) {
        console.error('CORS ERROR: El navegador bloqueó la petición');
      }

      throw error;
    }
  }

  // Partial update (PATCH)
  async patch<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('PATCH request to:', url);
    console.log('PATCH data:', data);

    try {
      const httpResponse: any = await firstValueFrom(
        this.http.patch(url, data, { headers: { 'Content-Type': 'application/json' }, observe: 'response', responseType: 'text' as 'json' }) as any
      );

      console.log('PATCH raw response status:', httpResponse.status);
      console.log('PATCH raw response body:', httpResponse.body);

      const bodyText = httpResponse.body;
      if (!bodyText) return null as any;
      try { return JSON.parse(bodyText); } catch { return bodyText; }
    } catch (error: any) {
      console.error('PATCH error details:', error);
      const bodyText = error?.error || error?.message || '';
      if (typeof bodyText === 'string' && /Cannot\s+PATCH\s+\/api/i.test(bodyText)) {
        console.warn('Detected proxy-miss HTML 404 for PATCH, retrying directly against API Gateway...');
        try {
          const directPath = endpoint.replace(/^\/api/, '');
          const altUrl = `${environment.apiGateway}${directPath}`;
          console.log('Retry PATCH direct to:', altUrl);
          const altResp: any = await firstValueFrom(
            this.http.patch(altUrl, data, { headers: { 'Content-Type': 'application/json' }, observe: 'response', responseType: 'text' as 'json' }) as any
          );
          const altBody = altResp?.body;
          try { return JSON.parse(altBody); } catch { return altBody; }
        } catch (altErr) {
          console.error('Direct PATCH retry failed:', altErr);
        }
      }

      if (error?.status === 0) {
        console.error('CORS ERROR during PATCH');
      }
      throw error;
    }
  }

  // Full replace (PUT)
  async put<T>(endpoint: string, data: any): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('PUT request to:', url);
    console.log('PUT data:', data);

    try {
      const httpResponse: any = await firstValueFrom(
        this.http.put(url, data, { headers: { 'Content-Type': 'application/json' }, observe: 'response', responseType: 'text' as 'json' }) as any
      );

      console.log('PUT raw response status:', httpResponse.status);
      console.log('PUT raw response body:', httpResponse.body);

      const bodyText = httpResponse.body;
      if (!bodyText) return null as any;
      try { return JSON.parse(bodyText); } catch { return bodyText; }
    } catch (error: any) {
      console.error('PUT error details:', error);
      const bodyText = error?.error || error?.message || '';
      if (typeof bodyText === 'string' && /Cannot\s+PUT\s+\/api/i.test(bodyText)) {
        console.warn('Detected proxy-miss HTML 404 for PUT, retrying directly against API Gateway...');
        try {
          const directPath = endpoint.replace(/^\/api/, '');
          const altUrl = `${environment.apiGateway}${directPath}`;
          console.log('Retry PUT direct to:', altUrl);
          const altResp: any = await firstValueFrom(
            this.http.put(altUrl, data, { headers: { 'Content-Type': 'application/json' }, observe: 'response', responseType: 'text' as 'json' }) as any
          );
          const altBody = altResp?.body;
          try { return JSON.parse(altBody); } catch { return altBody; }
        } catch (altErr) {
          console.error('Direct PUT retry failed:', altErr);
        }
      }

      if (error?.status === 0) {
        console.error('CORS ERROR during PUT');
      }
      throw error;
    }
  }
}
