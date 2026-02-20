import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { ROLES_KEY } from '../decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) { }

    canActivate(ctx: ExecutionContext): boolean {
        const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
            ctx.getHandler(),
            ctx.getClass(),
        ]);

        if (!roles || roles.length === 0) {
            return true;
        }

        const gqlCtx = GqlExecutionContext.create(ctx);
        const user = gqlCtx.getContext().req.user;

        if (!user) {
            throw new ForbiddenException('User not authenticated');
        }

        if (!roles.includes(user.role)) {
            throw new ForbiddenException('Access denied: insufficient permissions');
        }

        return true;
    }
}
