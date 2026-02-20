import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { WishlistItem } from './models/wishlist.model';
import { WishlistService } from './wishlist.service';
import { ToggleWishlistInput } from './dto/wishlist.input';

@Resolver(() => WishlistItem)
@UseGuards(GqlAuthGuard)
export class WishlistResolver {
    constructor(private readonly service: WishlistService) { }

    @Query(() => [WishlistItem])
    async wishlist(@CurrentUser() user: any) {
        return this.service.getWishlist(user.id);
    }

    @Mutation(() => [WishlistItem])
    async toggleWishlist(
        @CurrentUser() user: any,
        @Args('input') input: ToggleWishlistInput
    ) {
        return this.service.toggleWishlist(user.id, input.productId);
    }
}
