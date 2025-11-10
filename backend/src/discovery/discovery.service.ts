// This service contains the business logic for user discovery features, such as finding nearby recruiters or candidates.

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class DiscoveryService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Finds recruiters near a candidate using PostGIS spatial queries.
   * Filters out recruiters already swiped by the candidate.
   * @param userId The candidate's user ID
   * @param radiusInMeters Search radius in meters (default: 20,000)
   * @param coords Optional real-time coordinates {latitude, longitude}. If provided, uses these instead of profile location.
   * @returns Array of recruiter profiles with company info
   */
  async getRecruitersForCandidate(
    userId: string,
    radiusInMeters: number = 20000,
    coords?: { latitude: number; longitude: number }
  ) {
    // 1. Find the candidate profile and its location
    const candidateProfile = await this.prisma.candidateProfile.findUnique({
      where: { userId },
    });

    if (!candidateProfile) {
      throw new NotFoundException('Profil candidat introuvable.');
    }

    // Use real-time coordinates if provided, otherwise fall back to profile location
    let searchLocation: string;
    if (coords) {
      searchLocation = `POINT(${coords.longitude} ${coords.latitude})`;
    } else {
      if (!candidateProfile.locationWKT) {
        throw new NotFoundException('Votre localisation est requise pour la découverte.');
      }
      searchLocation = candidateProfile.locationWKT;
    }

    const candidateId = candidateProfile.id;

    // 2. Find recruiters already swiped by this candidate
    const swipedRecruiters = await this.prisma.swipe.findMany({
      where: { candidateId: candidateId },
      select: { recruiterId: true },
    });
    const swipedRecruiterIds = swipedRecruiters.map(s => s.recruiterId);

    // 3. Find nearby recruiters using PostGIS spatial query
    const nearbyRecruiterResults = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id"
      FROM "RecruiterProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        "locationWKT"::geography,
        ${searchLocation}::geography,
        ${radiusInMeters}
      )
    `;
    const nearbyRecruiterIds = nearbyRecruiterResults.map(r => r.id);

    // 4. Final query: recruiters who are nearby and not already swiped
    const finalRecruiters = await this.prisma.recruiterProfile.findMany({
      where: {
        id: {
          in: nearbyRecruiterIds,
          notIn: swipedRecruiterIds,
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
    // Map recruiters to include company name at the root level
    const recruitersWithCompany = finalRecruiters.map(recruiter => ({
      ...recruiter,
      companyName: recruiter.memberships?.[0]?.company?.name || null,
    }));
    return recruitersWithCompany;
  }

  /**
   * Finds candidates near a recruiter using PostGIS spatial queries.
   * Filters out candidates already swiped by the recruiter.
   * @param userId The recruiter's user ID
   * @param radiusInMeters Search radius in meters (default: 20,000)
   * @param coords Optional real-time coordinates {latitude, longitude}. If provided, uses these instead of profile location.
   * @returns Array of candidate profiles
   */
  async getCandidatesForRecruiter(
    userId: string,
    radiusInMeters: number = 20000,
    coords?: { latitude: number; longitude: number }
  ) {
    // 1. Find the recruiter profile and its location
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
    });

    if (!recruiterProfile) {
      throw new NotFoundException('Profil recruteur introuvable.');
    }

    // Use real-time coordinates if provided, otherwise fall back to profile location
    let searchLocation: string;
    if (coords) {
      searchLocation = `POINT(${coords.longitude} ${coords.latitude})`;
    } else {
      if (!recruiterProfile.locationWKT) {
        throw new NotFoundException('Votre localisation est requise pour la découverte.');
      }
      searchLocation = recruiterProfile.locationWKT;
    }

    const recruiterId = recruiterProfile.id;

    // 2. Find candidates already swiped by this recruiter
    const swipedCandidates = await this.prisma.swipe.findMany({
      where: { recruiterId: recruiterId },
      select: { candidateId: true },
    });
    const swipedCandidateIds = swipedCandidates.map(s => s.candidateId);

    // 3. Find nearby candidates using PostGIS spatial query
    const nearbyCandidateResults = await this.prisma.$queryRaw<Array<{ id: string }>>`
      SELECT "id"
      FROM "CandidateProfile"
      WHERE "locationWKT" IS NOT NULL
      AND ST_DWithin(
        "locationWKT"::geography,
        ${searchLocation}::geography,
        ${radiusInMeters}
      )
    `;
    const nearbyCandidateIds = nearbyCandidateResults.map(r => r.id);

    // 4. Final query: candidates who are nearby and not already swiped
    const finalCandidates = await this.prisma.candidateProfile.findMany({
      where: {
        id: {
          in: nearbyCandidateIds,
          notIn: swipedCandidateIds,
        },
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
    // 1. Find the recruiter profile
    const recruiterProfile = await this.prisma.recruiterProfile.findUnique({
      where: { userId },
      select: { id: true },
    });

    if (!recruiterProfile) {
      throw new NotFoundException('Profil recruteur introuvable.');
    }

    // 2. Find swipes where the candidate liked the recruiter, but the recruiter hasn't responded yet
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

    // 3. Return the list of candidate profiles
    return pendingSwipes.map(swipe => swipe.candidate);
  }
}
