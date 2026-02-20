import { Field, ID, ObjectType, Int } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';

@ObjectType()
export class OrderItem {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    productId: string;

    @Field(() => Int)
    quantity: number;

    @Field()
    unitPrice: number;
}

@ObjectType()
export class Order {
    @Field(() => ID)
    id: string;

    @Field()
    status: string;

    @Field()
    paymentStatus: string;

    @Field()
    subtotal: number;

    @Field()
    shipping: number;

    @Field()
    total: number;

    @Field(() => GraphQLJSONObject)
    shippingAddress: any;

    @Field(() => [OrderItem])
    items: OrderItem[];

    @Field()
    createdAt: string;
}
