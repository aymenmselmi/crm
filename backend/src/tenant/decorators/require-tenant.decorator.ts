import { SetMetadata } from '@nestjs/common';

export const RequireTenant = () => SetMetadata('requireTenant', true);
