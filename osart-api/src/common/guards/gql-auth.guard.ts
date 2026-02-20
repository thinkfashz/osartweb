import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { makeSupabaseAnon } from '../../config/supabase.client';

@Injectable()
export class GqlAuthGuard implements CanActivate {
    async canActivate(ctx: ExecutionContext): Promise<boolean> {
        const gqlCtx = GqlExecutionContext.create(ctx);
        const req = gqlCtx.getContext().req;

        const auth = req.headers['authorization'] as string | undefined;
        if (!auth?.startsWith('Bearer ')) {
            throw new UnauthorizedException('Missing Bearer token');
        }

        const token = auth.replace('Bearer ', '').trim();
        const supabase = makeSupabaseAnon();

        // Verify token with Supabase
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data?.user) {
            throw new UnauthorizedException('Invalid or expired token');
        }

        // Fetch profile and role
        const { data: profile } = await supabase
            .from('profiles')
            .select('id, full_name, role')
            .eq('id', data.user.id)
            .single();

        req.user = {
            id: data.user.id,
            email: data.user.email,
            role: profile?.role ?? 'customer',
            fullName: profile?.full_name ?? null,
        };

        return true;
    }
}
