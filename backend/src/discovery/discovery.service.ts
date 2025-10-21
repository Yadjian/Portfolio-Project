import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  // ANCIENNEMENT getJobsForCandidate
  async getRecruitersForCandidate(userId: string) {
    // 1. Trouver le profil candidat
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!candidateProfile) {
      throw new NotFoundException('Profil candidat non trouvé.');
    }

    // 2. Trouver les recruteurs que ce candidat a DÉJÀ swipés (pour les exclure)
    const swipedRecruiters = await this.prisma.swipe.findMany({
      where: { candidateId: candidateProfile.id },
      select: { recruiterId: true },
    });
    const swipedRecruiterIds = swipedRecruiters.map(s => s.recruiterId);

    // 3. Retourner les profils de recruteurs, sauf ceux déjà swipés
    return this.prisma.recruiterProfile.findMany({
      where: {
        // ... (Ajoute ici tes filtres de localisation/catégorie plus tard) ...
        id: {
          notIn: swipedRecruiterIds, // Exclure les profils déjà vus
        },
      },
      // Le front a besoin de TOUTES ces infos pour la carte
      include: {
        searchedCategories: true, 
      }
    });
  }

  // CETTE MÉTHODE EST MAINTENANT PLUS SIMPLE
  async getCandidatesForRecruiter(userId: string) {
    // 1. Trouver le profil du recruteur
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      select: { id: true },
    });
    if (!recruiterProfile) {
      throw new NotFoundException('Profil recruteur non trouvé.');
    }

    // 2. Trouver les candidats que ce recruteur a DÉJÀ swipés
    const swipedCandidates = await this.prisma.swipe.findMany({
      where: { recruiterId: recruiterProfile.id },
      select: { candidateId: true },
    });
    const swipedCandidateIds = swipedCandidates.map(s => s.candidateId);

    // 3. Retourner les profils de candidats, sauf ceux déjà swipés
    return this.prisma.candidateProfile.findMany({
      where: {
        // ... (Ajoute ici tes filtres de localisation/catégorie plus tard) ...
        id: {
          notIn: swipedCandidateIds, // Exclure les profils déjà vus
        },
      },
      // Le front a besoin de TOUTES ces infos pour la carte
      include: {
        interestedInCategories: true,
      }
    });
  }
}