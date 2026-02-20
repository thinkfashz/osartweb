import { Resolver, Query, Args, ID, Context } from '@nestjs/graphql';
import { UsersService } from './users.service';
import { User } from './models/user.model';
import { GraphQLJSONObject } from 'graphql-scalars';

@Resolver(() => User)
export class UsersResolver {
    constructor(private readonly usersService: UsersService) { }

    @Query(() => [User])
    async adminCustomers(@Args('search', { nullable: true }) search?: string) {
        return this.usersService.listAdminCustomers(search);
    }

    @Query(() => GraphQLJSONObject)
    async adminCustomerDetail(@Args('id', { type: () => ID }) id: string) {
        return this.usersService.getCustomerDetail(id);
    }

    @Query(() => User, { name: 'me', nullable: true })
    async me(@Context() ctx: any) {
        const user = ctx.req.user;
        if (!user) return null;
        return this.usersService.getCustomerDetail(user.id);
    }
}
