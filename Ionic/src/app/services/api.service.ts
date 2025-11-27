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

  private parseResponse(bodyText: string | null): any {
    if (!bodyText) return null;
    try {
      const parsed = JSON.parse(bodyText);
      
      if (parsed.statusCode && typeof parsed.body === 'string') {
        try {
          return JSON.parse(parsed.body);
        } catch {
          return parsed.body;
        }
      }
      
      if (parsed.status && typeof parsed.body === 'string') {
        try {
          return JSON.parse(parsed.body);
        } catch {
          return parsed.body;
        }
      }
      
      if (parsed.body && typeof parsed.body === 'string') {
        try {
          return JSON.parse(parsed.body);
        } catch {
          return parsed.body;
        }
      }
      
      return parsed;
    } catch {
      return bodyText;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    console.log('GET request to:', url);
    
    try {
      const httpResponse: any = await firstValueFrom(
        this.http.get(url, { observe: 'response', responseType: 'text' as 'json' }) as any
      );

      console.log('GET raw response status:', httpResponse.status);
      console.log('GET raw response body:', httpResponse.body);

      return this.parseResponse(httpResponse.body);
    } catch (error: any) {
      console.error('GET error details:');
      console.error('- Full error object:', error);
      console.error('- Status:', error.status);
      console.error('- StatusText:', error.statusText);
      console.error('- Error message:', error.message);
      console.error('- URL:', error.url);
      
      const bodyText = error?.error || error?.message || '';
      if (typeof bodyText === 'string' && /Cannot\s+GET\s+\/api/i.test(bodyText)) {
        console.warn('Detected proxy-miss HTML 404 for GET, retrying directly against API Gateway...');
        try {
          const directPath = endpoint.replace(/^\/api/, '');
          const altUrl = `${environment.apiGateway}${directPath}`;
          console.log('Retry GET direct to:', altUrl);
          const altResp: any = await firstValueFrom(
            this.http.get(altUrl, { observe: 'response', responseType: 'text' as 'json' }) as any
          );
          const altBody = altResp?.body;
          try {
            const parsed = JSON.parse(altBody);
            if (parsed.statusCode && typeof parsed.body === 'string') {
              try {
                return JSON.parse(parsed.body);
              } catch {
                return parsed.body;
              }
            }
            if (parsed.status && typeof parsed.body === 'string') {
              try {
                return JSON.parse(parsed.body);
              } catch {
                return parsed.body;
              }
            }
            
            if (parsed.body && typeof parsed.body === 'string') {
              try {
                return JSON.parse(parsed.body);
              } catch {
                return parsed.body;
              }
            }
            return parsed;
          } catch { 
            return altBody;
          }
        } catch (altErr) {
          console.error('Direct GET retry failed:', altErr);
        }
      }

      
      if (error.status === 404) {
        console.warn('Got 404 response, trying direct API Gateway...');
        try {
          const directPath = endpoint.replace(/^\/api/, '');
          const altUrl = `${environment.apiGateway}${directPath}`;
          console.log('Retry GET direct to:', altUrl);
          const altResp: any = await firstValueFrom(
            this.http.get(altUrl, { observe: 'response', responseType: 'text' as 'json' }) as any
          );
          const altBody = altResp?.body;
          try {
            const parsed = JSON.parse(altBody);
            
            if (parsed.statusCode && typeof parsed.body === 'string') {
              try {
                return JSON.parse(parsed.body);
              } catch {
                return parsed.body;
              }
            }
            
            if (parsed.status && typeof parsed.body === 'string') {
              try {
                return JSON.parse(parsed.body);
              } catch {
                return parsed.body;
              }
            }
            
            if (parsed.body && typeof parsed.body === 'string') {
              try {
                return JSON.parse(parsed.body);
              } catch {
                return parsed.body;
              }
            }
            return parsed;
          } catch { 
            return altBody;
          }
        } catch (altErr) {
          console.error('Direct GET retry failed:', altErr);
          throw error; 
        }
      }
      
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
     
      const httpResponse: any = await firstValueFrom(
        this.http.post(url, data, { headers: { 'Content-Type': 'application/json' }, observe: 'response', responseType: 'text' as 'json' }) as any
      );

      console.log('POST raw response status:', httpResponse.status);
      console.log('POST raw response body:', httpResponse.body);

      return this.parseResponse(httpResponse.body);
    } catch (error: any) {
      console.error('POST error details:');
      console.error('- Full error object:', error);
      console.error('- Status:', error.status);
      console.error('- StatusText:', error.statusText);
      console.error('- Error message:', error.message);
      console.error('- URL:', error.url);
      
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
      
      const httpResponse: any = await firstValueFrom(
        this.http.delete(url, { observe: 'response', responseType: 'text' as 'json' }) as any
      );

      console.log('DELETE raw response status:', httpResponse.status);
      console.log('DELETE raw response body:', httpResponse.body);

      return this.parseResponse(httpResponse.body);
    } catch (error: any) {
      console.error('DELETE error details:');
      console.error('- Full error object:', error);
      console.error('- Status:', error?.status);
      console.error('- StatusText:', error?.statusText);
      console.error('- Error message:', error?.message);
      console.error('- URL:', error?.url || url);

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

      return this.parseResponse(httpResponse.body);
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

      return this.parseResponse(httpResponse.body);
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
