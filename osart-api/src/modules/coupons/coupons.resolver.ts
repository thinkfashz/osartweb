import { Args, Float, Query, Resolver } from '@nestjs/graphql';
import { Coupon } from './models/coupon.model';
import { CouponsService } from './coupons.service';

@Resolver(() => Coupon)
export class CouponsResolver {
    constructor(private readonly service: CouponsService) { }

    @Query(() => Coupon)
    async validateCoupon(
        @Args('code') code: string,
        @Args('total', { type: () => Float }) total: number,
    ) {
        return this.service.validateCoupon(code, total);
    }
}
