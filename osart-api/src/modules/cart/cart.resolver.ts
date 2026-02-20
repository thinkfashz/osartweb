import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Cart } from './models/cart.model';
import { CartService } from './cart.service';
import { AddToCartInput, UpdateCartItemInput, MergeCartInput } from './dto/cart.input';

@Resolver(() => Cart)
@UseGuards(GqlAuthGuard)
export class CartResolver {
    constructor(private readonly service: CartService) { }

    @Query(() => Cart)
    async cart(@CurrentUser() user: any) {
        return this.service.getCart(user.id);
    }

    @Mutation(() => Cart)
    async addToCart(@CurrentUser() user: any, @Args('input') input: AddToCartInput) {
        return this.service.addToCart(user.id, input.productId, input.quantity);
    }

    @Mutation(() => Cart)
    async updateCartItem(@CurrentUser() user: any, @Args('input') input: UpdateCartItemInput) {
        return this.service.updateCartItem(user.id, input.itemId, input.quantity);
    }

    @Mutation(() => Cart)
    async removeCartItem(@CurrentUser() user: any, @Args('itemId') itemId: string) {
        return this.service.removeCartItem(user.id, itemId);
    }

    @Mutation(() => Cart)
    async mergeCart(@CurrentUser() user: any, @Args('input') input: MergeCartInput) {
        return this.service.mergeGuestCart(user.id, input.items);
    }
}
