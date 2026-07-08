// Fichier: backend/src/types/express.d.ts

// Define the structure of our JWT payload
interface UserPayload {
  sub: string;
  // Add other token fields if necessary
}

// Use TypeScript declaration merging to extend an existing interface
declare namespace Express {
  export interface Request {
    user: UserPayload;
  }
}
