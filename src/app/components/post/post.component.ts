import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { PostService } from '../../services/post/post.service';
import { Post } from '../../models/post.model';
import { RatingService } from '../../services/rating/rating.service';  // Asegúrate de importar RatingService

@Component({
  selector: 'app-post',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {

  posts: Post[] = []; // Lista de posts
  errorMessage: string = ''; // Variable para mostrar mensajes de error

  // Inicializamos un nuevo post con campos vacíos
  nuevoPost: Post = { 
    author: '', // El campo author será el nombre de usuario ingresado
    postType: '',
    content: '',
    image: '',
    postDate: new Date(),
    likes: 0, // Inicializamos el campo likes con 0
    dislikes: 0 // Inicializamos el campo dislikes con 0
  };
  
  isEditing: boolean = false;
  editIndex: number = -1;

  constructor(private postService: PostService, private ratingService: RatingService) {}

  ngOnInit() {
    this.getPosts(); // Carga los posts al inicializar el componente
  }

  // Obtener los posts existentes
  getPosts() {
    this.postService.getPosts().subscribe(
      (data: Post[]) => {
        this.posts = data.filter(exp => exp._id !== undefined);
        console.log('Posts recibidos:', data);
      },
      (error) => {
        console.error("Error al cargar los posts:", error);
      }
    );
  }

  // Verificar si el nombre de usuario existe en la base de datos
  verificarUsuario(username: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.postService.checkUsername(username).subscribe(
          (response) => {
              resolve(response.exists);
          },
          (error) => {
              reject(error);
          }
      );
    });
  }

  // Método para agregar o editar un post
  async addPost(postForm: any) {
    try {
      const userExists = await this.verificarUsuario(this.nuevoPost.author);

      if (!userExists) {
          this.errorMessage = 'El nombre de usuario no existe. Por favor, ingrese un usuario válido.';
          return;
      }

      if (this.isEditing) {
          // Actualizamos el post si estamos en modo edición
          const postId = this.posts[this.editIndex]._id;
          if (postId) {
              this.postService.updatePost(postId, { ...this.nuevoPost }).subscribe(
                  (updatedPost: Post) => {
                      this.posts[this.editIndex] = updatedPost;
                      this.resetFormulario(postForm);
                  },
                  (error: any) => {
                      console.error("Error al actualizar el post:", error);
                  }
              );
          } else {
              console.error("El ID del post es undefined.");
          }
      } else {
          // Creamos un nuevo post
          this.postService.createPost(this.nuevoPost).subscribe(
              (newPost: Post) => {
                  this.posts.push(newPost);
                  this.resetFormulario(postForm);
                  this.getPosts(); // Actualiza la lista de posts después de crear uno nuevo
              },
              (error: any) => {
                  console.error("Error al crear el post:", error);
                  this.errorMessage = 'Ocurrió un error al crear el post.';
              }
          );
      }
    } catch (error) {
        console.error("Error en la verificación del usuario:", error);
        this.errorMessage = 'Error al verificar el usuario. Inténtalo de nuevo.';
    }
  }

  // Método para agregar un like o dislike
  ratePost(postID: string, value: number) {
    // Asegurarse de que el valor sea 1 (like) o -1 (dislike)
    if (value !== 1 && value !== -1) return;

    const user = 'currentUser';  // Este valor debe obtenerse del sistema de autenticación en tu aplicación real
    
    // Llamar al servicio de rating para crear o actualizar la valoración
    this.postService.createOrUpdateRating(postID, user, value).subscribe(
      (response) => {
        // Actualizar el post en la interfaz con el nuevo número de likes/dislikes
        const updatedPost = this.posts.find(post => post._id === postID);
        if (updatedPost) {
          if (value === 1) {
            updatedPost.likes += 1;
          } else if (value === -1) {
            updatedPost.dislikes += 1;
          }
        }
      },
      (error) => {
        console.error("Error al valorar el post:", error);
        this.errorMessage = 'Error al valorar el post.';
      }
    );
  }

  // Preparar la edición de un post
  prepararEdicion(post: Post, index: number) {
    this.nuevoPost = { ...post };
    this.isEditing = true;
    this.editIndex = index;
  }

  // Eliminar un post
  eliminarElemento(index: number) {
    const postId = this.posts[index]._id;
    if (postId) {
      this.postService.deletePost(postId).subscribe(() => {
        this.posts.splice(index, 1);
      }, (error: any) => {
        console.error("Error al eliminar el post:", error);
      });
    } else {
      console.error("El ID del post a eliminar es undefined.");
    }
  }

  // Reiniciar la edición
  resetEdicion() {
    this.isEditing = false;
    this.resetFormulario();
  }

  // Reiniciar el formulario de post
  resetFormulario(postForm?: any) {
    this.nuevoPost = { 
      author: '', 
      postType: '',
      content: '',
      image: '',
      postDate: new Date(),
      likes: 0, 
      dislikes: 0
    }; 
    if (postForm) {
      postForm.resetForm();
    }
    this.isEditing = false;
    this.editIndex = -1;
  }

  // Método auxiliar para actualizar la lista de posts (opcional)
  actualizarLista() {
    this.getPosts(); // Re-fetch the posts from the server
    console.log('Lista actualizada:', this.posts);
  }
}
