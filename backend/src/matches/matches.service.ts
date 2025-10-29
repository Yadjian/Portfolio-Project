// src/matches/matches.service.ts
// This service contains business logic for retrieving and displaying user matches (candidate-recruiter matches).

import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class MatchesService {
  constructor(private prisma: PrismaService) {}

  /**
   * Retrieves all matches for the authenticated user.
   * The response is formatted for the frontend and includes the profile of the matched user.
   * @param userId The ID of the authenticated user
   */
  async findAllMatches(userId: string) {
    // Find the user and determine their role (candidate or recruiter)
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        candidateProfile: { select: { id: true } },
        recruiterProfile: { select: { id: true } },
      },
    });

    let whereClause;

    // Build the query based on the user's role
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
      throw new NotFoundException('Profile not found.');
    }

    // Retrieve all matches for the user, including the matched profile's details
    const matches = await this.prisma.swipe.findMany({
      where: whereClause,
      include: {
        // Include the profile of the OTHER person for display
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

    // Format the response for the frontend
    return matches.map(match => {
      if (user.candidateProfile) {
        // Candidate sees recruiters
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
        // Recruiter sees candidates
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

  /**
   * Retrieves details for a specific match (by swipe ID) for the authenticated user.
   * The returned data depends on the user's role:
   * - Candidate: receives the recruiter's job offers.
   * - Recruiter: receives the candidate's full profile.
   * @param userId The ID of the authenticated user
   * @param swipeId The ID of the swipe (match)
   */
  async getMatchDetails(userId: string, swipeId: string) {
    // 1. Find the match (swipe)
    const swipe = await this.prisma.swipe.findUnique({
      where: { id: swipeId },
      include: {
        candidate: { select: { userId: true, id: true } },
        recruiter: { select: { userId: true, id: true } },
      },
    });

    // 2. Security checks
    if (!swipe) {
      throw new NotFoundException('Match not found.');
    }
    if (!swipe.isMatch) {
      throw new ForbiddenException("This is not yet a match.");
    }

    // 3. Identify the user's role in the match
    const isUserCandidate = swipe.candidate.userId === userId;
    const isUserRecruiter = swipe.recruiter.userId === userId;

    if (!isUserCandidate && !isUserRecruiter) {
      throw new ForbiddenException('Unauthorized access to this match.');
    }

    // 4. Return content based on the user's role
    if (isUserCandidate) {
      // Candidate gets the recruiter's job offers
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
      // Recruiter gets the candidate's full profile (including resume URL)
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
