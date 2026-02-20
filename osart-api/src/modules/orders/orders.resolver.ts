import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Order } from './models/order.model';
import { OrdersService } from './orders.service';
import { SalesSummary } from './models/sales-summary.model';
import { GraphQLJSONObject } from 'graphql-scalars';

@Resolver(() => Order)
@UseGuards(GqlAuthGuard)
export class OrdersResolver {
    constructor(private readonly service: OrdersService) { }

    @Query(() => [Order])
    async orders(@CurrentUser() user: any) {
        return this.service.listOrders(user.id);
    }

    @Query(() => Order)
    async order(@CurrentUser() user: any, @Args('orderId') orderId: string) {
        return this.service.getOrder(user.id, orderId);
    }

    @Mutation(() => Order)
    async createOrderFromCart(
        @CurrentUser() user: any,
        @Args('shippingAddress', { type: () => GraphQLJSONObject }) shippingAddress: any,
        @Args('couponCode', { nullable: true }) couponCode?: string,
    ) {
        return this.service.createFromCart(user.id, shippingAddress, couponCode);
    }

    @Query(() => SalesSummary)
    async adminSalesSummary(@Args('dateRange', { defaultValue: '30d' }) dateRange: string) {
        return this.service.getSalesSummary(dateRange);
    }

    @Query(() => [GraphQLJSONObject]) // Using JSONObject for flexible admin order view
    async adminOrders(@Args('filter', { type: () => GraphQLJSONObject, nullable: true }) filter?: any) {
        return this.service.listAdminOrders(filter || {});
    }
}
