// Fichier : backend/src/auth/auth.service.ts

import { Injectable, InternalServerErrorException, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AuthService {
  // On injecte le logger pour avoir des messages clairs dans la console
  private readonly logger = new Logger(AuthService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Synchronise un utilisateur après son authentification via Auth0.
   * Si l'utilisateur n'existe pas dans la base de données locale, il est créé.
   * @param auth0User L'objet utilisateur décodé du token JWT d'Auth0.
   */
  async syncUser(auth0User: any) {
    // 'sub' est l'identifiant unique de l'utilisateur chez Auth0. C'est notre clé de synchronisation.
    const auth0Id = auth0User.sub;
    const email = auth0User.email;

    if (!auth0Id || !email) {
      this.logger.error('Token Auth0 invalide : sub ou email manquant.', auth0User);
      throw new InternalServerErrorException('Les informations de l"utilisateur Auth0 sont incomplètes.');
    }

    this.logger.log(`Synchronisation de l'utilisateur : ${email} (Auth0 ID: ${auth0Id})`);

    // 1. On cherche si un utilisateur avec cet ID Auth0 existe déjà.
    const user = await this.prisma.user.findUnique({
      where: { auth0Id },
      include: {
        // On inclut les profils pour renvoyer l'objet complet si l'utilisateur existe déjà.
        candidateProfile: true,
        recruiterProfile: true,
      },
    });

    if (user) {
      this.logger.log(`Utilisateur trouvé dans la DB. Retour de l'utilisateur existant.`);
      return user; // Si l'utilisateur existe, on le renvoie directement.
    }

    // 2. Si l'utilisateur n'existe pas, nous devons le créer.
    this.logger.log(`Nouvel utilisateur. Création dans la DB...`);

    // NOTE IMPORTANTE : Pour une vraie application, le choix du rôle (candidat/recruteur)
    // et les informations de base (prénom/nom) devraient être demandés à l'utilisateur
    // juste après sa première connexion dans l'application mobile.
    // L'application enverrait ces infos à un endpoint dédié pour compléter le profil.

    // Pour notre MVP, nous allons créer un profil "Candidat" par défaut,
    // que l'utilisateur pourra compléter plus tard.
    try {
      const newUser = await this.prisma.user.create({
        data: {
          email: email,
          auth0Id: auth0Id,
          // On crée le profil candidat en même temps que l'utilisateur,
          // en utilisant une transaction imbriquée (nested write).
          candidateProfile: {
            create: {
              firstName: 'Prénom à compléter', // Valeur par défaut
              lastName: 'Nom à compléter',   // Valeur par défaut
            },
          },
        },
        include: {
          // On s'assure que la réponse inclut bien le profil qui vient d'être créé.
          candidateProfile: true,
        },
      });

      this.logger.log(`Nouvel utilisateur créé avec succès : ${newUser.email}`);
      return newUser;
    } catch (error) {
      this.logger.error('Erreur lors de la création de l"utilisateur.', error.stack);
      throw new InternalServerErrorException('Une erreur est survenue lors de la création de l"utilisateur.');
    }
  }
}
