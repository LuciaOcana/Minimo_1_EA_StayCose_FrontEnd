import { Component, OnInit } from '@angular/core';
import { RatingService } from '../../services/rating/rating.service';  // Asegúrate de que la ruta sea correcta
import { FormsModule } from '@angular/forms';  // Asegúrate de que FormsModule esté importado aquí
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-rating',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.css']
})
export class RatingComponent implements OnInit {
  ratings: any[] = [];  // Asegúrate de definir la propiedad ratings
  userRating: number = 1;  // Valor por defecto de la valoración
  postId: string = '';
  user: string = 'user123';

  constructor(private ratingService: RatingService) {}

  ngOnInit(): void {
    this.loadRatings();  // Cargar las valoraciones cuando se inicia el componente
  }

  loadRatings() {
    this.ratingService.getRatings().subscribe((data) => {
      this.ratings = data;
    });
  }

  deleteRating(id: string) {
    this.ratingService.deleteRating(id).subscribe(() => {
      console.log('Valoración eliminada');
      this.loadRatings();  // Recargar las valoraciones después de eliminar
    });
  }

  submitRating() {
    const rating = {
      postID: this.postId,
      user: this.user,
      value: this.userRating,
      timestamp: new Date()
    };

    this.ratingService.createOrUpdateRating(rating).subscribe(response => {
      console.log('Valoración creada o actualizada', response);
    });
  }
}
