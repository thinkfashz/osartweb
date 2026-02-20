import { Field, ID, ObjectType, Int, Float } from '@nestjs/graphql';
import { GraphQLJSONObject } from 'graphql-scalars';
import { IsOptional } from 'class-validator';

@ObjectType()
export class ProductImage {
    @Field(() => ID)
    id: string;

    @Field()
    url: string;

    @Field(() => Int)
    position: number;
}

@ObjectType()
export class ProductVariant {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    value: string;

    @Field(() => Float, { nullable: true })
    price?: number;

    @Field(() => Int, { nullable: true })
    stock?: number;
}

@ObjectType()
export class Product {
    @Field(() => ID)
    id: string;

    @Field()
    name: string;

    @Field()
    slug: string;

    @Field({ nullable: true })
    description?: string;

    @Field({ nullable: true })
    brand?: string;

    @Field({ nullable: true })
    model?: string;

    @Field()
    price: number;

    @Field({ nullable: true })
    compareAtPrice?: number;

    @Field()
    stock: number;

    @Field()
    sku: string;

    @Field()
    isActive: boolean;

    @Field()
    createdAt: string;

    @Field(() => [ProductImage])
    images: ProductImage[];

    @Field(() => [ProductVariant])
    variants: ProductVariant[];

    @Field(() => GraphQLJSONObject, { nullable: true })
    @IsOptional()
    specs?: any;

    @Field({ nullable: true })
    category?: string;

    @Field(() => Boolean)
    outOfStock: boolean;

    @Field(() => Boolean)
    isLowStock: boolean;
}

@ObjectType()
export class PageInfo {
    @Field()
    hasNextPage: boolean;

    @Field({ nullable: true })
    endCursor?: string;
}

@ObjectType()
export class ProductEdge {
    @Field()
    cursor: string;

    @Field(() => Product)
    node: Product;
}

@ObjectType()
export class ProductsConnection {
    @Field(() => Int)
    totalCount: number;

    @Field(() => [ProductEdge])
    edges: ProductEdge[];

    @Field(() => PageInfo)
    pageInfo: PageInfo;
}

@ObjectType()
export class StockUpdate {
    @Field(() => ID)
    productId: string;

    @Field(() => Int)
    stock: number;

    @Field()
    updatedAt: string;
}
