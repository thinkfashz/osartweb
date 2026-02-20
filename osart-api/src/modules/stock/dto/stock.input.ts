import { Field, ID, InputType, Int } from '@nestjs/graphql';
import { StockMovementType } from '../models/stock-movement.model';

@InputType()
export class UpdateStockInput {
    @Field(() => ID)
    productId: string;

    @Field(() => Int)
    qty: number;

    @Field(() => StockMovementType)
    type: StockMovementType;

    @Field({ nullable: true })
    reason?: string;
}

@InputType()
export class StockMovementFilterInput {
    @Field(() => ID, { nullable: true })
    productId?: string;

    @Field(() => String, { nullable: true })
    startDate?: string;

    @Field(() => String, { nullable: true })
    endDate?: string;
}
