import { Field, ID, ObjectType, Int, registerEnumType } from '@nestjs/graphql';

export enum StockMovementType {
    IN = 'in',
    OUT = 'out',
    ADJUST = 'adjust',
}

registerEnumType(StockMovementType, {
    name: 'StockMovementType',
});

@ObjectType()
export class StockMovement {
    @Field(() => ID)
    id: string;

    @Field(() => ID)
    productId: string;

    @Field(() => StockMovementType)
    type: StockMovementType;

    @Field(() => Int)
    qty: number;

    @Field({ nullable: true })
    reason?: string;

    @Field()
    createdAt: string;
}
