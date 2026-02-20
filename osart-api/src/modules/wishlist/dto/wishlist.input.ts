import { Field, InputType } from '@nestjs/graphql';
import { IsUUID } from 'class-validator';

@InputType()
export class ToggleWishlistInput {
    @Field()
    @IsUUID()
    productId: string;
}
