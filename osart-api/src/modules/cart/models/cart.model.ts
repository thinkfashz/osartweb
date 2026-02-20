import { Field, ID, Int, ObjectType } from '@nestjs/graphql';
import { Product } from '../../products/models/product.model';

@ObjectType()
export class CartItem {
    @Field(() => ID)
    id: string;

    @Field(() => Int)
    quantity: number;

    @Field()
    unitPrice: number;

    @Field(() => Product)
    product: Product;
}

@ObjectType()
export class Cart {
    @Field(() => ID)
    id: string;

    @Field()
    status: string;

    @Field(() => [CartItem])
    items: CartItem[];

    @Field()
    subtotal: number;
}
