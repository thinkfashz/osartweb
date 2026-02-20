import { Field, ObjectType, Int } from '@nestjs/graphql';

@ObjectType()
export class TableStatus {
    @Field()
    name: string;

    @Field(() => Int)
    rowCount: number;

    @Field({ nullable: true })
    lastUpdate?: string;
}

@ObjectType()
export class DatabaseStatus {
    @Field()
    connected: boolean;

    @Field()
    databaseUrl: string;

    @Field(() => [TableStatus])
    tables: TableStatus[];

    @Field(() => Int)
    version: number;
}
