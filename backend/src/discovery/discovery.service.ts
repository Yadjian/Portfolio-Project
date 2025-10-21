// src/discovery/discovery.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * RÉINTÉGRATION DE POSTGIS
   * Trouve les recruteurs à proximité pour le deck du candidat.
   */
  async getRecruitersForCandidate(userId: string, radiusInMeters: number = 20000) { // 20km par défaut
    // 1. Trouver le profil du candidat ET sa localisation
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) {
      throw new NotFoundException('Profil candidat non trouvé.');
    }
    if (!candidateProfile.locationWKT) {
      throw new NotFoundException('Votre localisation est requise pour la découverte.');
    }
    const candidateId = candidateProfile.id;

    // 2. Trouver les recruteurs que ce candidat a DÉJÀ swipés
    const swipedRecruiters = await this.prisma.swipe.findMany({
      where: { candidateId: candidateId },
      select: { recruiterId: true },
    });
    const swipedRecruiterIds = swipedRecruiters.map(s => s.recruiterId);

    // 3. (NOUVEAU) Trouver les ID des recruteurs à proximité (PostGIS)
    const nearbyRecruiterResults = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id"
      FROM "RecruiterProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        ST_GeomFromText("locationWKT", 4326)::geography,
        ST_GeomFromText(${candidateProfile.locationWKT}, 4326),
        ${radiusInMeters}
      )
    `;
    const nearbyRecruiterIds = nearbyRecruiterResults.map(r => r.id);

    // 4. Requête finale : combine les deux filtres
    return this.prisma.recruiterProfile.findMany({
      where: {
        id: {
          in: nearbyRecruiterIds,     // Doit être à proximité
          notIn: swipedRecruiterIds, // Ne doit pas avoir été swipé
        },
      },
      include: {
        searchedCategories: true,
      },
    });
  }

  /**
   * RÉINTÉGRATION DE POSTGIS
   * Trouve les candidats à proximité pour le deck du recruteur.
   */
  async getCandidatesForRecruiter(userId: string,) {
    // 1. Trouver le profil du recruteur ET sa localisation
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!recruiterProfile) {
      throw new NotFoundException('Profil recruteur non trouvé.');
    }

    const pendingSwipes = await this.prisma.swipe.findMany({
      where: {
        recruiterId: recruiterProfile.id,
        candidateDirection: 'RIGHT',
        recruiterDirection: null, // C'est la clé !
      },
      include: {
        // Inclure le profil du candidat pour afficher la carte
        candidate: {
          include: {
            interestedInCategories: true, // Inclure les détails du profil
          },
        },
      },
    });

    // 3. Renvoyer la liste des profils de candidats
    // (Le recruteur peut être n'importe où, cette liste est persistante)
    return pendingSwipes.map(swipe => swipe.candidate);
  }
}
