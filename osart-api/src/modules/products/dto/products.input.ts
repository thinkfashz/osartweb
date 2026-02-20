import { Field, InputType, Int } from '@nestjs/graphql';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { GraphQLJSONObject } from 'graphql-scalars';

@InputType()
export class ProductsFilterInput {
    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    search?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    categorySlug?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    brand?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    model?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    minPrice?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    maxPrice?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    page?: number;

    @Field(() => Int, { nullable: true })
    @IsOptional()
    @IsInt()
    @Min(1)
    limit?: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    inStockOnly?: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsBoolean()
    isActive?: boolean;
}

@InputType()
export class CreateProductInput {
    @Field()
    @IsString()
    name: string;

    @Field()
    @IsString()
    sku: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    description?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    brand?: string;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    model?: string;

    @Field()
    @IsNumber()
    price: number;

    @Field({ nullable: true })
    @IsOptional()
    @IsNumber()
    compareAtPrice?: number;

    @Field(() => Int)
    @IsInt()
    @Min(0)
    stock: number;

    @Field()
    @IsBoolean()
    isActive: boolean;

    @Field({ nullable: true })
    @IsOptional()
    @IsString()
    categoryId?: string;

    @Field(() => GraphQLJSONObject, { nullable: true })
    @IsOptional()
    specs?: any;
}
