import { Field, ID, ObjectType, Float } from '@nestjs/graphql';

@ObjectType()
export class Coupon {
    @Field(() => ID)
    id: string;

    @Field()
    code: string;

    @Field()
    type: string;

    @Field(() => Float)
    value: number;

    @Field(() => Float)
    minTotal: number;

    @Field()
    active: boolean;

    @Field({ nullable: true })
    startDate?: Date;

    @Field({ nullable: true })
    endDate?: Date;
}
