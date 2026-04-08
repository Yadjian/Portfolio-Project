// src/matches/matches.service.ts
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  async findAllMatches(userId: string) {
    // 🔒 Validation sécurisée des entrées
    if (!userId) {
      throw new BadRequestException(
        'Utilisateur requis pour voir les matches.',
      );
    }

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: { select: { id: true } },
        recruiterProfile: { select: { id: true } },
      },
    });

    // 🛡️ SÉCURITÉ : Vérifier que l'utilisateur existe
    if (!user) {
      throw new NotFoundException('Utilisateur introuvable.');
    }

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

    // 🔒 Log de sécurité pour audit
    console.log(
      `✅ Matches list accessed by user ${userId}: ${matches.length} matches found`,
    );

    // On formate la réponse pour le front
    return matches.map((match) => {
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
    // 🔒 Validation sécurisée des entrées
    if (!userId || !swipeId) {
      throw new BadRequestException('Utilisateur et ID de match requis.');
    }

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
      console.warn(
        `🚨 MATCH IDOR BLOCKED: User ${userId} tried to access match ${swipeId} without authorization`,
      );
      throw new ForbiddenException('Accès non autorisé à ce match.');
    }

    // 🔒 Log de sécurité pour audit
    console.log(
      `✅ Match details accessed: ${swipeId} by user ${userId} (candidate: ${isUserCandidate}, recruiter: ${isUserRecruiter})`,
    );

    // 4. Renvoyer le "contenu" en fonction du rôle
    if (isUserCandidate) {
      // Le CANDIDAT obtient les offres du recruteur
      const jobOffers = await this.prisma.jobOffer.findMany({
        where: {
          createdById: swipe.recruiterId,
          isActive: true,
        },
        include: {
          company: true,
          categories: true,
        },
      });

      // 🔒 Log pour audit
      console.log(
        `✅ Candidate ${userId} accessed ${jobOffers.length} job offers from match ${swipeId}`,
      );
      return jobOffers;
    }

    if (isUserRecruiter) {
      // Le RECRUTEUR obtient le profil complet du candidat
      // C'est ici qu'on renvoie le `resumeUrl` (le lien du CV)
      const candidateProfile = await this.prisma.candidateProfile.findUnique({
        where: {
          id: swipe.candidateId,
        },
        include: {
          interestedInCategories: true,
        },
      });

      // 🔒 Log pour audit
      console.log(
        `✅ Recruiter ${userId} accessed candidate profile from match ${swipeId}`,
      );
      return candidateProfile;
    }
  }
}
