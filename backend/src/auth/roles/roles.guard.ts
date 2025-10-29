// This file implements a guard to restrict access to routes based on user roles

import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Retrieve required roles from metadata set by the Roles decorator
    const requiredRoles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // If no roles are required, allow access
    if (!requiredRoles) {
      return true;
    }

    // Get the user object from the request
    const { user } = context.switchToHttp().getRequest();
    // Extract the user's role from the JWT payload
    const userRole = user['https://mova.app/role'];

    // Allow access if the user's role matches one of the required roles
    return requiredRoles.some((role) => userRole === role);
  }
}
