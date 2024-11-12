import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';  // Asegúrate de que la ruta sea correcta

@Injectable({
  providedIn: 'root'
})
export class RatingService {
  private apiUrl = `${environment.apiUrl}/ratings`;  // La URL base de la API para las valoraciones

  constructor(private http: HttpClient) {}

  // Obtener todas las valoraciones
  getRatings(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl);
  }

  // Crear o actualizar una valoración
  createOrUpdateRating(rating: any): Observable<any> {
    // Si la valoración tiene un ID, hacemos un PUT para actualizarla
    if (rating._id) {
      return this.http.put<any>(`${this.apiUrl}/${rating._id}`, rating);
    }
    // Si no tiene un ID, creamos una nueva valoración con un POST
    return this.http.post<any>(this.apiUrl, rating);
  }

  // Eliminar una valoración
  deleteRating(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }
}
