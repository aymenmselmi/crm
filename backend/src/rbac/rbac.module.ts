import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RbacService } from './rbac.service';
import { RbacController } from './rbac.controller';
import { RolesGuard, PermissionsGuard } from './guards';
import { Role, Permission, User } from '../database/entities/tenant';

@Module({
  imports: [TypeOrmModule.forFeature([Role, Permission, User])],
  providers: [RbacService, RolesGuard, PermissionsGuard],
  controllers: [RbacController],
  exports: [RbacService, RolesGuard, PermissionsGuard],
})
export class RbacModule {}
