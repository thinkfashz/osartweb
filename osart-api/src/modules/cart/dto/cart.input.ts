import { Field, InputType, Int } from '@nestjs/graphql';
import { IsInt, IsUUID, Min } from 'class-validator';

@InputType()
export class AddToCartInput {
    @Field()
    @IsUUID()
    productId: string;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    quantity: number;
}

@InputType()
export class UpdateCartItemInput {
    @Field()
    @IsUUID()
    itemId: string;

    @Field(() => Int)
    @IsInt()
    @Min(1)
    quantity: number;
}
@InputType()
export class GuestCartItemInput {
    @Field()
    productId: string;

    @Field(() => Int)
    quantity: number;
}

@InputType()
export class MergeCartInput {
    @Field(() => [GuestCartItemInput])
    items: GuestCartItemInput[];
}
