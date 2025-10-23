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
    console.log('🔍 [Discovery] Getting recruiters for candidate userId:', userId);
    
    // 1. Trouver le profil du candidat ET sa localisation
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    console.log('👤 [Discovery] Candidate profile:', candidateProfile ? {
      id: candidateProfile.id,
      name: `${candidateProfile.firstName} ${candidateProfile.lastName}`,
      locationWKT: candidateProfile.locationWKT,
    } : 'NOT FOUND');

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
    console.log('🚫 [Discovery] Already swiped recruiters:', swipedRecruiterIds.length);

    // 3. (NOUVEAU) Trouver les ID des recruteurs à proximité (PostGIS)
    console.log('🔎 [Discovery] Searching for recruiters within', radiusInMeters, 'meters from', candidateProfile.locationWKT);
    
    const nearbyRecruiterResults = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id"
      FROM "RecruiterProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        ST_GeomFromText("locationWKT", 4326)::geography,
        ST_GeomFromText(${candidateProfile.locationWKT}, 4326)::geography,
        ${radiusInMeters}
      )
    `;
    const nearbyRecruiterIds = nearbyRecruiterResults.map(r => r.id);
    console.log('📍 [Discovery] Nearby recruiters found:', nearbyRecruiterIds.length, nearbyRecruiterIds);

    // 4. Requête finale : combine les deux filtres
    const finalRecruiters = await this.prisma.recruiterProfile.findMany({
      where: {
        id: {
          in: nearbyRecruiterIds,     // Doit être à proximité
          notIn: swipedRecruiterIds, // Ne doit pas avoir été swipé
        },
      },
      include: {
        searchedCategories: true,
        memberships: {
          include: {
            company: true,
          },
        },
      },
    });
    
    console.log('✅ [Discovery] Final recruiters to return:', finalRecruiters.length);
    
    // Mapper pour ajouter le nom de l'entreprise au niveau racine
    const recruitersWithCompany = finalRecruiters.map(recruiter => ({
      ...recruiter,
      companyName: recruiter.memberships?.[0]?.company?.name || null,
    }));
    
    console.log('🏢 [Discovery] Sample recruiter with company:', recruitersWithCompany[0] ? {
      firstName: recruitersWithCompany[0].firstName,
      lastName: recruitersWithCompany[0].lastName,
      companyName: recruitersWithCompany[0].companyName,
      hasMemberships: !!recruitersWithCompany[0].memberships?.length,
    } : 'No recruiters');
    
    return recruitersWithCompany;
  }

  /**
   * RÉINTÉGRATION DE POSTGIS
   * Trouve les candidats à proximité pour le deck du recruteur.
   */
  async getCandidatesForRecruiter(userId: string, radiusInMeters: number = 20000) { // 20km par défaut
    console.log('🔍 [Discovery] Getting candidates for recruiter userId:', userId);
    
    // 1. Trouver le profil du recruteur ET sa localisation
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    console.log('👤 [Discovery] Recruiter profile:', recruiterProfile ? {
      id: recruiterProfile.id,
      name: `${recruiterProfile.firstName} ${recruiterProfile.lastName}`,
      locationWKT: recruiterProfile.locationWKT,
    } : 'NOT FOUND');

    if (!recruiterProfile) {
      throw new NotFoundException('Profil recruteur non trouvé.');
    }
    if (!recruiterProfile.locationWKT) {
      throw new NotFoundException('Votre localisation est requise pour la découverte.');
    }
    const recruiterId = recruiterProfile.id;

    // 2. Trouver les candidats que ce recruteur a DÉJÀ swipés
    const swipedCandidates = await this.prisma.swipe.findMany({
      where: { recruiterId: recruiterId },
      select: { candidateId: true },
    });
    const swipedCandidateIds = swipedCandidates.map(s => s.candidateId);
    console.log('🚫 [Discovery] Already swiped candidates:', swipedCandidateIds.length);

    // 3. Trouver les ID des candidats à proximité (PostGIS)
    console.log('🔎 [Discovery] Searching for candidates within', radiusInMeters, 'meters from', recruiterProfile.locationWKT);
    
    const nearbyCandidateResults = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id"
      FROM "CandidateProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        ST_GeomFromText("locationWKT", 4326)::geography,
        ST_GeomFromText(${recruiterProfile.locationWKT}, 4326)::geography,
        ${radiusInMeters}
      )
    `;
    const nearbyCandidateIds = nearbyCandidateResults.map(r => r.id);
    console.log('📍 [Discovery] Nearby candidates found:', nearbyCandidateIds.length, nearbyCandidateIds);

    // 4. Requête finale : combine les deux filtres
    const finalCandidates = await this.prisma.candidateProfile.findMany({
      where: {
        id: {
          in: nearbyCandidateIds,     // Doit être à proximité
          notIn: swipedCandidateIds, // Ne doit pas avoir été swipé
        },
      },
      include: {
        interestedInCategories: true,
      },
    });
    
    console.log('✅ [Discovery] Final candidates to return:', finalCandidates.length);
    
    return finalCandidates;
  }

  /**
   * Trouve les candidats qui ont swipé RIGHT sur le recruteur (notifications).
   */
  async getPendingCandidatesForRecruiter(userId: string) {
    // 1. Trouver le profil du recruteur
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
