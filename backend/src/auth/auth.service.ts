import { Injectable, BadRequestException, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { DataSource } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { RegisterDto, LoginDto } from './dto';
import { GlobalUser, Organization } from '../database/entities/master';
import { TenantProvisioningService } from '../tenant/services';

@Injectable()
export class AuthService {
  private logger = new Logger(AuthService.name);

  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
    private dataSource: DataSource,
    private tenantProvisioning: TenantProvisioningService,
  ) {}

  async register(registerDto: RegisterDto) {
    const { email, password, firstName, lastName, organizationName, organizationSlug, phone } = registerDto;

    this.logger.log(`📝 Registering new user: ${email} for organization: ${organizationName}`);

    // Get master database connection
    const masterRepository = this.dataSource.getRepository(Organization);
    const globalUserRepository = this.dataSource.getRepository(GlobalUser);

    // Check if organization already exists
    let organization = await masterRepository.findOne({
      where: { slug: organizationSlug },
    });

    if (organization) {
      throw new BadRequestException(`Organization with slug '${organizationSlug}' already exists`);
    }

    // Check if user already exists
    const existingUser = await globalUserRepository.findOne({
      where: { email },
    });

    if (existingUser) {
      throw new BadRequestException('Email already registered');
    }

    // Provision new tenant database
    this.logger.log(`🚀 Provisioning tenant database for: ${organizationName}`);
    organization = await this.tenantProvisioning.provisionTenant(
      organizationName,
      organizationSlug,
      email, // Use email as the user ID for now (will be replaced when user is created)
    );

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create global user
    const globalUser = globalUserRepository.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
      organizationId: organization.id,
      phone,
      role: 'admin', // First user in org is admin
      emailVerified: false,
    });

    await globalUserRepository.save(globalUser);

    this.logger.log(`✅ User registered successfully: ${email} (org: ${organizationName})`);

    // Return JWT token
    return this.generateToken(globalUser);
  }

  async login(loginDto: LoginDto) {
    const { email, password } = loginDto;

    const globalUserRepository = this.dataSource.getRepository(GlobalUser);
    const user = await globalUserRepository.findOne({
      where: { email },
      relations: ['organization'],
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Update last login
    user.lastLogin = new Date();
    await globalUserRepository.save(user);

    // Return JWT token
    return this.generateToken(user);
  }

  private generateToken(user: GlobalUser) {
    const payload = {
      sub: user.id,
      email: user.email,
      organizationId: user.organizationId,
      role: user.role,
    };

    return {
      accessToken: this.jwtService.sign(payload, {
        expiresIn: this.configService.get<string>('JWT_EXPIRATION') || '3600s',
      }),
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        organizationId: user.organizationId,
        role: user.role,
      },
    };
  }

  async refreshToken(user: any) {
    const globalUserRepository = this.dataSource.getRepository(GlobalUser);
    const foundUser = await globalUserRepository.findOne({
      where: { id: user.id },
    });

    if (!foundUser) {
      throw new UnauthorizedException('User not found');
    }

    return this.generateToken(foundUser);
  }
}
