import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

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

    // Ajouter le rôle basé sur les profils
    return users.map(user => ({
      ...user,
      role: user.candidateProfile 
        ? 'candidate' 
        : user.recruiterProfile 
        ? 'recruiter' 
        : 'admin',
    }));
  }

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
      throw new NotFoundException('Utilisateur non trouvé');
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

  async createUser(dto: CreateUserDto) {
    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email,
        password: hashedPassword,
      },
    });

    // Créer le profil selon le rôle
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

    return this.getUserById(user.id);
  }

  async updateUser(id: string, dto: UpdateUserDto) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Mettre à jour l'email ou le mot de passe si fourni
    const updateData: any = {};
    if (dto.email) updateData.email = dto.email;
    if (dto.password) updateData.password = await bcrypt.hash(dto.password, 10);

    if (Object.keys(updateData).length > 0) {
      await this.prisma.user.update({
        where: { id },
        data: updateData,
      });
    }

    // Mettre à jour le profil selon le rôle
    if (dto.candidateData) {
      const existing = await this.prisma.candidateProfile.findUnique({ where: { userId: id } });
      if (existing) {
        await this.prisma.candidateProfile.update({
          where: { userId: id },
          data: dto.candidateData,
        });
      }
    }

    if (dto.recruiterData) {
      const existing = await this.prisma.recruiterProfile.findUnique({ where: { userId: id } });
      if (existing) {
        await this.prisma.recruiterProfile.update({
          where: { userId: id },
          data: dto.recruiterData,
        });
      }
    }

    return this.getUserById(id);
  }

  async deleteUser(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) {
      throw new NotFoundException('Utilisateur non trouvé');
    }

    // Supprimer les profils associés (cascade devrait le faire automatiquement)
    await this.prisma.user.delete({ where: { id } });

    return { message: 'Utilisateur supprimé' };
  }
}
