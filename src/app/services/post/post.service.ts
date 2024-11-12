// post.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Post } from '../../models/post.model';
import { Rating } from '../../models/rating.model'; // Asegúrate de que este modelo exista

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private apiUrl = `${environment.apiUrl}/posts`;
  private userApiUrl = `${environment.apiUrl}/user`; // URL para los endpoints de usuario
  private ratingApiUrl = `${environment.apiUrl}/ratings`; // URL para las valoraciones

  constructor(private http: HttpClient) { }

  // Obtener todos los posts con paginación
  getPosts(page: number = 1, limit: number = 10): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}?page=${page}&limit=${limit}`);
  }

  // Crear un nuevo post
  createPost(post: Post): Observable<Post> {
    return this.http.post<Post>(this.apiUrl, post);
  }

  // Actualizar un post por ID
  updatePost(id: string, post: Post): Observable<Post> {
    return this.http.put<Post>(`${this.apiUrl}/${id}`, post);
  }

  // Eliminar un post por ID
  deletePost(id: string): Observable<any> {
    return this.http.delete<any>(`${this.apiUrl}/${id}`);
  }

  // Obtener un post por ID
  getPostById(id: string): Observable<Post> {
    return this.http.get<Post>(`${this.apiUrl}/${id}`);
  }

  // Obtener todos los posts de un autor específico
  getPostsByAuthorId(authorId: string): Observable<Post[]> {
    return this.http.get<Post[]>(`${this.apiUrl}/${authorId}/authorPosts`);
  }

  // Verificar si el nombre de usuario existe
  checkUsername(username: string): Observable<{ exists: boolean }> {
    return this.http.get<{ exists: boolean }>(`${this.userApiUrl}/check-username/${username}`);
  }

  // Método para crear o actualizar una valoración (like o dislike)
  createOrUpdateRating(postID: string, user: string, value: number): Observable<any> {
    const ratingData: Rating = { postID, user, value, timestamp: new Date()  };
    return this.http.post(`${this.ratingApiUrl}`, ratingData);  // Ruta de la API de valoraciones
  }
}
