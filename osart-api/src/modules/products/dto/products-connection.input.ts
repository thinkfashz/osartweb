import { Field, InputType, Int, registerEnumType } from '@nestjs/graphql';

export enum ProductSort {
    NEWEST = 'NEWEST',
    PRICE_ASC = 'PRICE_ASC',
    PRICE_DESC = 'PRICE_DESC',
    POPULAR = 'POPULAR',
}

registerEnumType(ProductSort, {
    name: 'ProductSort',
});

@InputType()
export class PaginationInput {
    @Field(() => Int, { nullable: true })
    first?: number;

    @Field({ nullable: true })
    after?: string;
}
