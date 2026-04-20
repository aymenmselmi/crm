import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { DataSource } from 'typeorm';
import { User } from '../../database/entities/tenant';
import { Role } from '../../database/entities/tenant';

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private dataSource: DataSource,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // Get permissions from @Permissions decorator
    const requiredPermissions = this.reflector.get<string[]>('permissions', context.getHandler());
    
    // If no permissions specified, allow access
    if (!requiredPermissions || requiredPermissions.length === 0) {
      return true;
    }

    // Get request and user
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user) {
      throw new ForbiddenException('User not found');
    }

    // Get user from database with roles and permissions
    const userRepository = this.dataSource.getRepository(User);
    const dbUser = await userRepository.findOne({
      where: { id: user.id },
      relations: ['roles', 'roles.permissions'],
    });

    if (!dbUser) {
      throw new ForbiddenException('User not found in database');
    }

    // Get all permissions from user's roles
    const userPermissions = new Set<string>();
    dbUser.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        userPermissions.add(permission.name);
      });
    });

    // Check if user has all required permissions
    const hasAllPermissions = requiredPermissions.every((permission) =>
      userPermissions.has(permission),
    );

    if (!hasAllPermissions) {
      throw new ForbiddenException(`Required permissions: ${requiredPermissions.join(', ')}`);
    }

    return true;
  }
}
