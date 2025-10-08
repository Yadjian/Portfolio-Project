// Fichier: backend/src/types/express.d.ts

// On définit la structure de notre payload JWT
interface UserPayload {
  sub: string;
  // Ajoutez d'autres champs du token si nécessaire
}

// On utilise le "declaration merging" de TypeScript pour étendre une interface existante
declare namespace Express {
  export interface Request {
    user: UserPayload;
  }
}
