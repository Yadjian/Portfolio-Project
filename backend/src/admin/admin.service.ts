import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  // Retrieve all users with their profiles and roles
  async getAllUsers() {
    const users = await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        candidateProfile: {
          select: {
            firstName: true,
            lastName: true,
            locationName: true,
            desiredJobTitle: true,
            experienceLevel: true,
            desiredContractTypes: true,
            coverLetterText: true,
            interestedInCategories: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
        recruiterProfile: {
          select: {
            firstName: true,
            lastName: true,
            locationName: true,
            searchDescription: true,
            desiredContractTypes: true,
            desiredExperienceLevel: true,
            searchedCategories: {
              select: {
                id: true,
                name: true,
              },
            },
            memberships: {
              select: {
                company: {
                  select: {
                    name: true,
                    siret: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    // Add a role property based on the user's profile
    return users.map((user) => ({
      ...user,
      role: user.candidateProfile
        ? 'candidate'
        : user.recruiterProfile
          ? 'recruiter'
          : 'admin',
    }));
  }

  // Retrieve a single user by ID, including their profiles and role
  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        createdAt: true,
        updatedAt: true,
        candidateProfile: true,
        recruiterProfile: {
          include: {
            memberships: {
              include: {
                company: true,
              },
            },
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return {
      ...user,
      role: user.candidateProfile
        ? 'candidate'
        : user.recruiterProfile
          ? 'recruiter'
          : 'admin',
    };
  }

  // Create a new user and their profile based on the role
  async createUser(dto: CreateUserDto) {
    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    // Create the user in the database
    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    // Create the appropriate profile if candidate or recruiter data is provided
    if (dto.role === 'candidate' && dto.candidateData) {
      await this.prisma.candidateProfile.create({
        data: {
          userId: user.id,
          ...dto.candidateData,
        },
      });
    } else if (dto.role === 'recruiter' && dto.recruiterData) {
      await this.prisma.recruiterProfile.create({
        data: {
          userId: user.id,
          ...dto.recruiterData,
        },
      });
    }

    // Return the newly created user with profile and role
    return this.getUserById(user.id);
  }

  // Update user information and their profile if provided
  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Prepare update data for user fields
    const updateData: any = {};
    if (dto.email) updateData.email = dto.email;
    if (dto.password) updateData.password = await bcrypt.hash(dto.password, 10);

    // Update user fields if any are provided
    if (Object.keys(updateData).length > 0) {
      await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    }

    // Update candidate profile if candidateData is provided
    if (dto.candidateData) {
      const existing = await this.prisma.candidateProfile.findUnique({
        where: { userId: id },
      });
      if (existing) {
        await this.prisma.candidateProfile.update({
          where: { userId: id },
          data: dto.candidateData,
        });
      }
    }

    // Update recruiter profile if recruiterData is provided
    if (dto.recruiterData) {
      const existing = await this.prisma.recruiterProfile.findUnique({
        where: { userId: id },
      });
      if (existing) {
        await this.prisma.recruiterProfile.update({
          where: { userId: id },
          data: dto.recruiterData,
        });
      }
    }

    // Return the updated user with profile and role
    return this.getUserById(id);
  }

  // Delete a user and their associated profiles
  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Delete the user (cascade should remove profiles automatically)
    await this.prisma.user.delete({ where: { id } });

    return { message: 'User deleted' };
  }
}
