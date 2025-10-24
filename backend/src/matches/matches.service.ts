// src/matches/matches.service.ts
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async findAllMatches(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: { select: { id: true } },
        recruiterProfile: { select: { id: true } },
      },
    });

    let whereClause;

    // On construit la requête en fonction du rôle
    if (user.candidateProfile) {
      whereClause = {
        candidateId: user.candidateProfile.id,
        isMatch: true,
      };
    } else if (user.recruiterProfile) {
      whereClause = {
        recruiterId: user.recruiterProfile.id,
        isMatch: true,
      };
    } else {
      throw new NotFoundException('Profil non trouvé.');
    }

    const matches = await this.prisma.swipe.findMany({
      where: whereClause,
      include: {
        // Inclure le profil de l'AUTRE personne pour l'affichage
        candidate: {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true, 
            photoUrl: true,
            desiredJobTitle: true,
            desiredContractTypes: true,
          },
        },
        recruiter: {
          select: { 
            id: true, 
            firstName: true, 
            lastName: true,
            searchedCategories: {
              select: { name: true },
              take: 1,
            },
            desiredContractTypes: true,
            memberships: {
              include: {
                company: {
                  select: { name: true },
                },
              },
              take: 1,
            },
          },
        },
      },
    });

    // On formate la réponse pour le front
    return matches.map(match => {
      if (user.candidateProfile) {
        // Candidat voit les recruteurs
        const recruiter = match.recruiter;
        return {
          matchId: match.id,
          matchedAt: match.matchedAt,
          profile: {
            ...recruiter,
            companyName: recruiter.memberships?.[0]?.company?.name || null,
            searchedJobTitle: recruiter.searchedCategories?.[0]?.name || null,
            contractType: recruiter.desiredContractTypes?.[0] || null,
          },
        };
      } else {
        // Recruteur voit les candidats
        const candidate = match.candidate;
        return {
          matchId: match.id,
          matchedAt: match.matchedAt,
          profile: {
            ...candidate,
            contractType: candidate.desiredContractTypes?.[0] || null,
          },
        };
      }
    });
  }
  async getMatchDetails(userId: string, swipeId: string) {
    // 1. Trouver le match
    const swipe = await this.prisma.swipe.findUnique({
      where: { id: swipeId },
      include: {
        candidate: { select: { userId: true, id: true } },
        recruiter: { select: { userId: true, id: true } },
      },
    });

    // 2. Vérifications de sécurité
    if (!swipe) {
      throw new NotFoundException('Match non trouvé.');
    }
    if (!swipe.isMatch) {
      throw new ForbiddenException("Ce n'est pas encore un match.");
    }

    // 3. Identifier l'utilisateur
    const isUserCandidate = swipe.candidate.userId === userId;
    const isUserRecruiter = swipe.recruiter.userId === userId;

    if (!isUserCandidate && !isUserRecruiter) {
      throw new ForbiddenException('Accès non autorisé à ce match.');
    }

    // 4. Renvoyer le "contenu" en fonction du rôle
    if (isUserCandidate) {
      // Le CANDIDAT obtient les offres du recruteur
      return this.prisma.jobOffer.findMany({
        where: {
          createdById: swipe.recruiterId,
          isActive: true,
        },
        include: {
          company: true,
          categories: true,
        },
      });
    }

    if (isUserRecruiter) {
      // Le RECRUTEUR obtient le profil complet du candidat
      // C'est ici qu'on renvoie le `resumeUrl` (le lien du CV)
      return this.prisma.candidateProfile.findUnique({
        where: {
          id: swipe.candidateId,
        },
        include: {
          interestedInCategories: true,
        },
      });
    }
  }
}
