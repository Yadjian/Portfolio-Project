import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AdminService } from './admin.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('admin')
// Apply JwtAuthGuard to all routes in this controller to require authentication
@UseGuards(JwtAuthGuard)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  // GET /admin/users
  // Returns a list of all users in the system
  @Get('users')
  getAllUsers() {
    return this.adminService.getAllUsers();
  }

  // GET /admin/users/:id
  // Returns details for a specific user by their ID
  @Get('users/:id')
  getUserById(@Param('id') id: string) {
    return this.adminService.getUserById(id);
  }

  // POST /admin/users
  // Creates a new user with the provided data
  @Post('users')
  createUser(@Body() dto: CreateUserDto) {
    return this.adminService.createUser(dto);
  }

  // PUT /admin/users/:id
  // Updates an existing user with the provided data
  @Put('users/:id')
  updateUser(@Param('id') id: string, @Body() dto: UpdateUserDto) {
    return this.adminService.updateUser(id, dto);
  }

  // DELETE /admin/users/:id
  // Deletes a user by their ID
  @Delete('users/:id')
  deleteUser(@Param('id') id: string) {
    return this.adminService.deleteUser(id);
  }
}
