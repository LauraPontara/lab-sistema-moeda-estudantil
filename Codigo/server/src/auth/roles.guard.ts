import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import type { JwtPayload } from './jwt-payload.interface';
import { ROLES_KEY } from './roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const metadata = Reflect.getMetadata(ROLES_KEY, context.getHandler()) as
      | unknown[]
      | undefined;
    const requiredRoles = (metadata ?? []).filter(
      (value): value is string => typeof value === 'string',
    );

    if (requiredRoles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest<{ user: JwtPayload }>();
    const userRole = request.user?.role;

    if (!userRole || !requiredRoles.includes(userRole)) {
      throw new ForbiddenException('Acesso restrito a administradores.');
    }

    return true;
  }
}
