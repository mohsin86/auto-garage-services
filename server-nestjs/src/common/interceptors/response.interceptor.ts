import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { map, Observable } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      map((data) => {
        // allow custom override
        if (data?.success !== undefined) {
          return data;
        }

        return {
          success: true,
          message: data?.message || 'Request successful',
          data: data?.data ?? data ?? null,
          meta: data?.meta ?? null,
        };
      }),
    );
  }
}