// Fichier: backend/src/profile/profile.controller.ts

import {
  Controller,
  Get,
  Put,
  Post,
  Delete,
  UseGuards,
  Req,
  Body,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  HttpCode,
  HttpStatus,
  BadRequestException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Request } from 'express';
import { ProfileService } from './profile.service';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { UpdateLocationDto } from './dto/update-location.dto';
import { UpdateLiveLocationDto } from './dto/update-live-location.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('me')
  @UseGuards(AuthGuard('jwt'))
  getProfile(@Req() req: Request) {
    const userId = req.user.sub;
    return this.profileService.getUserProfile(userId);
  }

  @Put('me')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photoFile'))
  async updateProfile(
    @Req() req: Request,
    @Body() updateProfileDto: UpdateProfileDto,
    @UploadedFile(
      new ParseFilePipe({
        fileIsRequired: false,
        validators: [
          new MaxFileSizeValidator({ maxSize: 3 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|jpg|png|webp|gif)$/i,
          }), // ✅ Message supprimé
        ],
      }),
    )
    photoFile?: Express.Multer.File,
  ) {
    try {
      const userId = req.user.sub;
      return await this.profileService.updateProfile(
        userId,
        updateProfileDto,
        photoFile,
      );
    } catch (error) {
      if (error.response?.statusCode === 400) {
        console.warn(
          'Validation error in updateProfile:',
          error.response.message,
        );
      }
      throw error;
    }
  }

  @Put('location')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateLocation(
    @Req() req: Request,
    @Body() updateLocationDto: UpdateLocationDto,
  ) {
    try {
      const userId = req.user.sub;
      return await this.profileService.updateUserLocation(
        userId,
        updateLocationDto,
      );
    } catch (error) {
      if (error.message?.includes('ST_GeomFromText')) {
        throw new BadRequestException(
          'Coordonnées GPS invalides. Vérifiez le format.',
        );
      }
      throw error;
    }
  }

  @Put('live-location')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  async updateLiveLocation(
    @Req() req: Request,
    @Body() updateLiveLocationDto: UpdateLiveLocationDto,
  ) {
    const userId = req.user.sub;
    return this.profileService.updateUserLiveLocation(userId, updateLiveLocationDto);
  }

  @Get('categories')
  async getJobCategories() {
    return this.profileService.getJobCategories();
  }

  @Put('photo')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('photoFile'))
  @HttpCode(HttpStatus.OK)
  async uploadProfilePhoto(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 3 * 1024 * 1024 }),
          new FileTypeValidator({
            fileType: /^image\/(jpeg|jpg|png|webp|gif)$/i,
          }), // ✅ Message supprimé
        ],
      }),
    )
    photoFile: Express.Multer.File,
  ) {
    try {
      const userId = req.user.sub;
      return await this.profileService.updateProfilePhoto(userId, photoFile);
    } catch (error) {
      console.warn('Photo upload error:', error.message);
      throw error;
    }
  }

  @Put('resume')
  @UseGuards(AuthGuard('jwt'))
  @UseInterceptors(FileInterceptor('resumeFile'))
  @HttpCode(HttpStatus.OK)
  async uploadResume(
    @Req() req: Request,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 7 * 1024 * 1024 }),
          new FileTypeValidator({ fileType: /^application\/pdf$/i }), // ✅ Message supprimé
        ],
      }),
    )
    file: Express.Multer.File,
  ) {
    try {
      const user = req.user as { sub: string };
      return await this.profileService.updateResume(user.sub, file);
    } catch (error) {
      console.warn('Resume upload error:', error.message);
      throw error;
    }
  }

  @Delete('resume')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  deleteResume(@Req() req: Request) {
    const user = req.user as { sub: string };
    return this.profileService.deleteResume(user.sub);
  }

  @Post('push-token')
  @UseGuards(AuthGuard('jwt'))
  @HttpCode(HttpStatus.OK)
  updatePushToken(@Req() req: Request, @Body('token') token: string) {
    const userId = req.user.sub;
    return this.profileService.updatePushToken(userId, token);
  }
}
