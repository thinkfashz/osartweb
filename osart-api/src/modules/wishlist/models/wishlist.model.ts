import { Field, ID, ObjectType } from '@nestjs/graphql';
import { Product } from '../../products/models/product.model';

@ObjectType()
export class WishlistItem {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    userId: string;

    @Field(() => ID)
    productId: string;

    @Field(() => Product)
    product: Product;

    @Field()
    createdAt: Date;
}
