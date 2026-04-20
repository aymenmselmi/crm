import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Opportunity } from '@/database/entities/tenant/opportunity.entity';
import { OpportunityService } from './opportunities.service';
import { OpportunitiesController } from './opportunities.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Opportunity])],
  providers: [OpportunityService],
  controllers: [OpportunitiesController],
  exports: [OpportunityService],
})
export class OpportunitiesModule {}
