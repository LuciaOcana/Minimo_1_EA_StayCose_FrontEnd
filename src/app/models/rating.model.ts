import { User } from "./user.model";

export interface Rating {
    postID: string;    // Relaciona el rating con el post al que valora
    user: string;      // Relaciona el rating con el usuario que hizo la valoración
    value: number;     // 1 para "me gusta" y -1 para "no me gusta"
    timestamp: Date;   // Fecha y hora de la valoración
  }
  