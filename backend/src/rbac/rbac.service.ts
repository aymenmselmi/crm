import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Role, Permission, User } from '../database/entities/tenant';
import { CreateRoleDto, CreatePermissionDto } from './dto';

@Injectable()
export class RbacService {
  constructor(private dataSource: DataSource) {}

  // ==================== PERMISSIONS ====================

  async createPermission(createPermissionDto: CreatePermissionDto) {
    const permissionRepository = this.dataSource.getRepository(Permission);
    const permission = permissionRepository.create(createPermissionDto);
    return await permissionRepository.save(permission);
  }

  async getPermissions() {
    const permissionRepository = this.dataSource.getRepository(Permission);
    return await permissionRepository.find();
  }

  async getPermissionsByModule(module: string) {
    const permissionRepository = this.dataSource.getRepository(Permission);
    return await permissionRepository.find({ where: { module } });
  }

  // ==================== ROLES ====================

  async createRole(createRoleDto: CreateRoleDto) {
    const roleRepository = this.dataSource.getRepository(Role);
    const permissionRepository = this.dataSource.getRepository(Permission);

    const role = roleRepository.create({
      name: createRoleDto.name,
      description: createRoleDto.description,
      type: 'custom',
    });

    // Add permissions if provided
    if (createRoleDto.permissionIds && createRoleDto.permissionIds.length > 0) {
      role.permissions = await permissionRepository.findByIds(createRoleDto.permissionIds);
    }

    return await roleRepository.save(role);
  }

  async getRoles() {
    const roleRepository = this.dataSource.getRepository(Role);
    return await roleRepository.find({ relations: ['permissions'] });
  }

  async getRoleById(id: string) {
    const roleRepository = this.dataSource.getRepository(Role);
    return await roleRepository.findOne({
      where: { id },
      relations: ['permissions'],
    });
  }

  async updateRolePermissions(roleId: string, permissionIds: string[]) {
    const roleRepository = this.dataSource.getRepository(Role);
    const permissionRepository = this.dataSource.getRepository(Permission);

    const role = await roleRepository.findOne({
      where: { id: roleId },
      relations: ['permissions'],
    });

    if (!role) {
      throw new Error('Role not found');
    }

    // Update permissions
    role.permissions = await permissionRepository.findByIds(permissionIds);
    return await roleRepository.save(role);
  }

  // ==================== USER ROLES ====================

  async assignRolesToUser(userId: string, roleIds: string[]) {
    const userRepository = this.dataSource.getRepository(User);
    const roleRepository = this.dataSource.getRepository(Role);

    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['roles'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Assign roles
    user.roles = await roleRepository.findByIds(roleIds);
    return await userRepository.save(user);
  }

  async getUserRoles(userId: string) {
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    return user.roles;
  }

  async getUserPermissions(userId: string): Promise<string[]> {
    const userRepository = this.dataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: userId },
      relations: ['roles', 'roles.permissions'],
    });

    if (!user) {
      throw new Error('User not found');
    }

    // Collect all permissions from user's roles
    const permissions = new Set<string>();
    user.roles?.forEach((role) => {
      role.permissions?.forEach((permission) => {
        permissions.add(permission.name);
      });
    });

    return Array.from(permissions);
  }

  // ==================== SEED DATA ====================

  async seedDefaultRoles() {
    const roleRepository = this.dataSource.getRepository(Role);
    const permissionRepository = this.dataSource.getRepository(Permission);

    // Check if roles already exist
    const existingRoles = await roleRepository.find();
    if (existingRoles.length > 0) {
      return;
    }

    // Create default permissions
    const permissions = await permissionRepository.save([
      { name: 'account.create', module: 'accounts', action: 'create' },
      { name: 'account.read', module: 'accounts', action: 'read' },
      { name: 'account.update', module: 'accounts', action: 'update' },
      { name: 'account.delete', module: 'accounts', action: 'delete' },
      { name: 'contact.create', module: 'contacts', action: 'create' },
      { name: 'contact.read', module: 'contacts', action: 'read' },
      { name: 'contact.update', module: 'contacts', action: 'update' },
      { name: 'contact.delete', module: 'contacts', action: 'delete' },
      { name: 'lead.create', module: 'leads', action: 'create' },
      { name: 'lead.read', module: 'leads', action: 'read' },
      { name: 'lead.update', module: 'leads', action: 'update' },
      { name: 'lead.delete', module: 'leads', action: 'delete' },
      { name: 'opportunity.create', module: 'opportunities', action: 'create' },
      { name: 'opportunity.read', module: 'opportunities', action: 'read' },
      { name: 'opportunity.update', module: 'opportunities', action: 'update' },
      { name: 'opportunity.delete', module: 'opportunities', action: 'delete' },
      { name: 'users.manage', module: 'users', action: 'manage' },
      { name: 'roles.manage', module: 'roles', action: 'manage' },
    ]);

    // Create default roles
    const adminPermissions = permissions;
    const managerPermissions = permissions.filter((p) =>
      ['read', 'create', 'update'].some((action) => p.name.includes(action)),
    );
    const userPermissions = permissions.filter((p) => p.name.includes('read'));

    // Create and save roles one by one
    const adminRole = roleRepository.create({
      name: 'Admin',
      description: 'Administrator with full access',
      type: 'admin',
      isDefault: false,
      permissions: adminPermissions,
    });

    const managerRole = roleRepository.create({
      name: 'Manager',
      description: 'Manager with read/create/update access',
      type: 'manager',
      isDefault: false,
      permissions: managerPermissions,
    });

    const userRole = roleRepository.create({
      name: 'User',
      description: 'Standard user with read-only access',
      type: 'user',
      isDefault: true,
      permissions: userPermissions,
    });

    await roleRepository.save([adminRole, managerRole, userRole]);
  }
}
