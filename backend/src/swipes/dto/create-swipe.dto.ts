// This DTO is used to validate and transfer data when creating a new swipe action (like/dislike) between users.

import { IsEnum, IsString, IsOptional, IsUUID } from 'class-validator';
import { SwipeDirection } from '@prisma/client'; // Import the enum from Prisma

export class CreateSwipeDto {

  /**
   * The ID of the profile being swiped on.
   * If the user is a Candidate, this will be a recruiterId.
   * If the user is a Recruiter, this will be a candidateId.
   */
  @IsUUID() // Must be a valid UUID
  profileId: string;

  @IsEnum(SwipeDirection) // Must be either 'LEFT' or 'RIGHT'
  direction: SwipeDirection; // The swipe direction (like/dislike)
}
