import { Controller, Get, Post, Body, Param, UseGuards, BadRequestException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { RbacService } from './rbac.service';
import { RolesGuard } from './guards';
import { Roles } from './decorators';
import { CreateRoleDto, CreatePermissionDto } from './dto';

@ApiTags('RBAC')
@Controller('rbac')
export class RbacController {
  constructor(private rbacService: RbacService) {}

  // ==================== PERMISSIONS ====================

  @Get('permissions')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all permissions' })
  async getPermissions() {
    return await this.rbacService.getPermissions();
  }

  @Get('permissions/module/:module')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get permissions by module' })
  async getPermissionsByModule(@Param('module') module: string) {
    return await this.rbacService.getPermissionsByModule(module);
  }

  @Post('permissions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new permission (Admin only)' })
  async createPermission(@Body() createPermissionDto: CreatePermissionDto) {
    return await this.rbacService.createPermission(createPermissionDto);
  }

  // ==================== ROLES ====================

  @Get('roles')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all roles' })
  async getRoles() {
    return await this.rbacService.getRoles();
  }

  @Get('roles/:id')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get role by ID' })
  async getRoleById(@Param('id') id: string) {
    const role = await this.rbacService.getRoleById(id);
    if (!role) {
      throw new BadRequestException('Role not found');
    }
    return role;
  }

  @Post('roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Create new role (Admin only)' })
  async createRole(@Body() createRoleDto: CreateRoleDto) {
    return await this.rbacService.createRole(createRoleDto);
  }

  @Post('roles/:roleId/permissions')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Update role permissions (Admin only)' })
  async updateRolePermissions(
    @Param('roleId') roleId: string,
    @Body('permissionIds') permissionIds: string[],
  ) {
    return await this.rbacService.updateRolePermissions(roleId, permissionIds);
  }

  // ==================== USER ROLES ====================

  @Get('users/:userId/roles')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user roles' })
  async getUserRoles(@Param('userId') userId: string) {
    return await this.rbacService.getUserRoles(userId);
  }

  @Get('users/:userId/permissions')
  @UseGuards(AuthGuard('jwt'))
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get user permissions' })
  async getUserPermissions(@Param('userId') userId: string) {
    return await this.rbacService.getUserPermissions(userId);
  }

  @Post('users/:userId/roles')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Assign roles to user (Admin only)' })
  async assignRolesToUser(
    @Param('userId') userId: string,
    @Body('roleIds') roleIds: string[],
  ) {
    return await this.rbacService.assignRolesToUser(userId, roleIds);
  }

  // ==================== SEEDING ====================

  @Post('seed')
  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles('Admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Seed default roles and permissions (Admin only)' })
  async seedDefaultRoles() {
    await this.rbacService.seedDefaultRoles();
    return { message: 'Default roles and permissions seeded successfully' };
  }
}
