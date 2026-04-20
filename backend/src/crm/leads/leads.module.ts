import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Lead } from '@/database/entities/tenant/lead.entity';
import { LeadService } from './leads.service';
import { LeadsController } from './leads.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Lead])],
  providers: [LeadService],
  controllers: [LeadsController],
  exports: [LeadService],
})
export class LeadsModule {}
