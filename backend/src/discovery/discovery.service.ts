// This service contains the business logic for user discovery features, such as finding nearby recruiters or candidates.

import { Injectable, NotFoundException } from '@nestjs/common';
import { ExperienceLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Maps experience level to a list of acceptable levels.
   * DEBUTANT accepts only DEBUTANT.
   * INTERMEDIAIRE accepts DEBUTANT and INTERMEDIAIRE.
   * CONFIRME accepts DEBUTANT, INTERMEDIAIRE, and CONFIRME.
   */
  private mapExperienceLevels(level?: string): ExperienceLevel[] {
    if (!level) return ['DEBUTANT', 'INTERMEDIAIRE', 'CONFIRME'];
    const mapping = {
      DEBUTANT: ['DEBUTANT'],
      INTERMEDIAIRE: ['DEBUTANT', 'INTERMEDIAIRE'],
      CONFIRME: ['DEBUTANT', 'INTERMEDIAIRE', 'CONFIRME'],
    };
    return (mapping[level] || []) as ExperienceLevel[];
  }

  /**
   * Finds recruiters near a candidate using PostGIS spatial queries.
   * Filters out recruiters already swiped by the candidate.
   * @param userId The candidate's user ID
   * @param radiusInMeters Search radius in meters
   * @param coords Optional real-time coordinates {latitude, longitude}. If provided, uses these instead of profile location.
   * @returns Array of recruiter profiles with company info
   */
  async getRecruitersForCandidate(
    userId: string,
    radiusInMeters: number = 250,
    coords?: { latitude: number; longitude: number },
  ) {
    // Find the candidate profile and its location
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
      include: {
        interestedInCategories: true,
      },
    });

    if (!candidateProfile) {
      throw new NotFoundException('Profil candidat introuvable.');
    }

    // Coordinates are required for real-time discovery
    if (!coords || !coords.latitude || !coords.longitude) {
      throw new NotFoundException(
        'Votre localisation est requise pour la découverte.',
      );
    }

    const searchLocation = `POINT(${coords.longitude} ${coords.latitude})`;

    const candidateId = candidateProfile.id;

    // Find recruiters already swiped by this candidate
    const swipedRecruiters = await this.prisma.swipe.findMany({
      where: { candidateId: candidateId },
      select: { recruiterId: true },
    });
    const swipedRecruiterIds = swipedRecruiters.map((s) => s.recruiterId);

    // Find nearby recruiters using PostGIS spatial query
    const nearbyRecruiterResults = await this.prisma.$queryRaw<
      Array<{ id: string }>
    >`
      SELECT "id"
      FROM "RecruiterProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        "locationWKT"::geography,
        ${searchLocation}::geography,
        ${radiusInMeters}
      )
    `;
    const nearbyRecruiterIds = nearbyRecruiterResults.map((r) => r.id);

    // Final query: recruiters who are nearby and not already swiped, matching candidate preferences
    const finalRecruiters = await this.prisma.recruiterProfile.findMany({
      where: {
        id: {
          in: nearbyRecruiterIds,
          notIn: swipedRecruiterIds,
        },
        // Apply candidate preferences
        ...(candidateProfile.interestedInCategories?.length && {
          searchedCategories: {
            some: {
              id: { in: candidateProfile.interestedInCategories.map((c) => c.id) },
            },
          },
        }),
        ...(candidateProfile.desiredContractTypes?.length && {
          desiredContractTypes: { hasSome: candidateProfile.desiredContractTypes },
        }),
        ...(candidateProfile.experienceLevel && {
          desiredExperienceLevel: {
            in: this.mapExperienceLevels(candidateProfile.experienceLevel),
          },
        }),
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
    // Map recruiters to include company name at the root level
    const recruitersWithCompany = finalRecruiters.map((recruiter) => ({
      ...recruiter,
      companyName: recruiter.memberships?.[0]?.company?.name || null,
    }));
    return recruitersWithCompany;
  }

  /**
   * Finds candidates near a recruiter using PostGIS spatial queries.
   * Filters out candidates already swiped by the recruiter.
   * @param userId The recruiter's user ID
   * @param radiusInMeters Search radius in meters (default: 250)
   * @param coords Required real-time coordinates {latitude, longitude} for discovery.
   * @returns Array of candidate profiles
   */
  async getCandidatesForRecruiter(
    userId: string,
    radiusInMeters: number = 250,
    coords?: { latitude: number; longitude: number },
  ) {
    // Find the recruiter profile and its location
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      include: {
        searchedCategories: true,
      },
    });

    if (!recruiterProfile) {
      throw new NotFoundException('Profil recruteur introuvable.');
    }

    // Coordinates are required for real-time discovery
    if (!coords || !coords.latitude || !coords.longitude) {
      throw new NotFoundException(
        'Votre localisation est requise pour la découverte.',
      );
    }

    const searchLocation = `POINT(${coords.longitude} ${coords.latitude})`;

    const recruiterId = recruiterProfile.id;

    // Find candidates already swiped by this recruiter
    const swipedCandidates = await this.prisma.swipe.findMany({
      where: { recruiterId: recruiterId },
      select: { candidateId: true },
    });
    const swipedCandidateIds = swipedCandidates.map((s) => s.candidateId);

    // Find nearby candidates using PostGIS spatial query
    const nearbyCandidateResults = await this.prisma.$queryRaw<
      Array<{ id: string }>
    >`
      SELECT "id"
      FROM "CandidateProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        "locationWKT"::geography,
        ${searchLocation}::geography,
        ${radiusInMeters}
      )
    `;
    const nearbyCandidateIds = nearbyCandidateResults.map((r) => r.id);

    // Final query: candidates who are nearby and not already swiped, matching recruiter preferences
    const finalCandidates = await this.prisma.candidateProfile.findMany({
      where: {
        id: {
          in: nearbyCandidateIds,
          notIn: swipedCandidateIds,
        },
        // Apply recruiter preferences
        ...(recruiterProfile.searchedCategories?.length && {
          interestedInCategories: {
            some: {
              id: { in: recruiterProfile.searchedCategories.map((c) => c.id) },
            },
          },
        }),
        ...(recruiterProfile.desiredContractTypes?.length && {
          desiredContractTypes: { hasSome: recruiterProfile.desiredContractTypes },
        }),
        ...(recruiterProfile.desiredExperienceLevel && {
          experienceLevel: {
            in: this.mapExperienceLevels(recruiterProfile.desiredExperienceLevel),
          },
        }),
      },
      include: {
        interestedInCategories: true,
      },
    });
    return finalCandidates;
  }

  /**
   * Finds candidates who have swiped RIGHT on the recruiter (pending notifications).
   * @param userId The recruiter's user ID
   * @returns Array of candidate profiles who are pending for the recruiter
   */
  async getPendingCandidatesForRecruiter(userId: string) {
    // Find the recruiter profile
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!recruiterProfile) {
      throw new NotFoundException('Profil recruteur introuvable.');
    }

    // Find swipes where the candidate liked the recruiter, but the recruiter hasn't responded yet
    const pendingSwipes = await this.prisma.swipe.findMany({
      where: {
        recruiterId: recruiterProfile.id,
        candidateDirection: 'RIGHT',
        recruiterDirection: null, // Recruiter has not responded yet
      },
      include: {
        // Include candidate profile details for display
        candidate: {
          include: {
            interestedInCategories: true,
          },
        },
      },
    });

    // Return the list of candidate profiles
    return pendingSwipes.map((swipe) => swipe.candidate);
  }
}
