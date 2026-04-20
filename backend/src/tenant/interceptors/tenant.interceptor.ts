import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { TenantContextService } from '../services/tenant-context.service';

@Injectable()
export class TenantInterceptor implements NestInterceptor {
  constructor(private tenantContextService: TenantContextService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    console.log('\n=== TenantInterceptor Start ===');
    console.log('Request:', request.method, request.url);
    console.log('User:', user ? `${user.email} (${user.id})` : 'MISSING');
    
    if (user && user.organizationId) {
      const organizationId = user.organizationId;
      const userId = user.id;

      console.log('Setting TenantContext - organizationId:', organizationId);
      this.tenantContextService.setTenantContext(organizationId, userId);
      console.log('TenantContext SET');
    } else {
      console.log('ERROR: No user or organizationId in request');
    }

    console.log('=== TenantInterceptor calling handler ===\n');

    return next.handle().pipe(
      tap(response => {
        console.log('=== TenantInterceptor response - cleaning up ===');
        // Clear context after request is done
        this.tenantContextService.clear();
      }),
      catchError(error => {
        console.error('=== TenantInterceptor ERROR ===');
        console.error('Error:', error.message);
        // Clear context even on error
        this.tenantContextService.clear();
        throw error;
      }),
    );
  }
}
