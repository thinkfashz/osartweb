import { Field, ID, ObjectType, Float, Int } from '@nestjs/graphql';

@ObjectType()
export class User {
    @Field(() => ID)
    id: string;

    @Field({ nullable: true })
    fullName?: string;

    @Field()
    email: string;

    @Field({ nullable: true })
    phone?: string;

    @Field()
    createdAt: string;

    @Field(() => Int, { defaultValue: 0 })
    totalOrders: number;

    @Field(() => Float, { defaultValue: 0 })
    totalSpent: number;

    @Field({ nullable: true })
    role?: string;
}
