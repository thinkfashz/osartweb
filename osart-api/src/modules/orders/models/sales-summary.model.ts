import { Field, ObjectType, Int, Float } from '@nestjs/graphql';

@ObjectType()
export class DailyRevenue {
    @Field()
    date: string;

    @Field(() => Float)
    revenue: number;

    @Field(() => Int)
    orders: number;
}

@ObjectType()
export class TopProductSales {
    @Field()
    productId: string;

    @Field()
    name: string;

    @Field(() => Int)
    unitsSold: number;

    @Field(() => Float)
    revenue: number;
}

@ObjectType()
export class SalesSummary {
    @Field(() => Float)
    totalRevenue: number;

    @Field(() => Int)
    totalOrders: number;

    @Field(() => Float)
    avgOrderValue: number;

    @Field(() => [DailyRevenue])
    revenueByDay: DailyRevenue[];

    @Field(() => [TopProductSales])
    topProducts: TopProductSales[];
}
