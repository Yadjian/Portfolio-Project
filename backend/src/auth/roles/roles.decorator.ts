// This file defines a custom decorator for specifying required roles on route handlers

import { SetMetadata } from '@nestjs/common';

// Key used to store roles metadata
export const ROLES_KEY = 'roles';

// Roles decorator: attaches required roles metadata to route handlers
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles);
