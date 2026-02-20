import { Resolver, Query, Args, ResolveField, Parent, Mutation, Subscription, ID } from '@nestjs/graphql';
import { ProductsService } from './products.service';
import { Product, ProductImage, ProductVariant, ProductsConnection, StockUpdate } from './models/product.model';
import { CreateProductInput, ProductsFilterInput } from './dto/products.input';
import { PaginationInput, ProductSort } from './dto/products-connection.input';
import { Category } from '../categories/models/category.model';
import { Inject } from '@nestjs/common';
import { PubSub } from 'graphql-subscriptions';

@Resolver(() => Product)
export class ProductsResolver {
    constructor(
        private readonly productsService: ProductsService,
        @Inject('PUB_SUB') private readonly pubSub: PubSub
    ) { }

    @Query(() => ProductsConnection)
    async productsConnection(
        @Args('filter', { nullable: true }) filter?: ProductsFilterInput,
        @Args('sort', { nullable: true }) sort?: ProductSort,
        @Args('pagination', { nullable: true }) pagination?: PaginationInput
    ) {
        return this.productsService.findConnection(filter, sort, pagination);
    }

    @Query(() => [Product])
    async products(@Args('filter', { nullable: true }) filter?: ProductsFilterInput) {
        const conn = await this.productsService.findConnection(filter);
        return conn.edges.map(e => e.node);
    }

    @Query(() => [Product])
    async adminProducts(@Args('filter', { nullable: true }) filter?: ProductsFilterInput) {
        // High privilege version, can include inactive items or specific stock focus
        const conn = await this.productsService.findConnection(filter);
        return conn.edges.map(e => e.node);
    }

    @Query(() => Product)
    async productBySlug(@Args('slug') slug: string) {
        return this.productsService.bySlug(slug);
    }

    @Query(() => [Product])
    async relatedProducts(
        @Args('productId', { type: () => ID }) productId: string,
        @Args('limit', { nullable: true, defaultValue: 12 }) limit: number
    ) {
        return this.productsService.getRelated(productId, limit);
    }

    @Mutation(() => Product)
    async createProduct(@Args('input') input: CreateProductInput) {
        return this.productsService.create(input);
    }

    @Subscription(() => StockUpdate, {
        name: 'stockUpdated',
        filter: (payload, variables) => {
            if (!variables.productIds || variables.productIds.length === 0) return true;
            return variables.productIds.includes(payload.stockUpdated.productId);
        }
    })
    stockUpdatedSubscription(@Args('productIds', { type: () => [String], nullable: true }) productIds?: string[]) {
        return (this.pubSub as any).asyncIterator('stockUpdated');
    }

    @ResolveField(() => [ProductImage])
    async images(@Parent() product: Product) {
        return this.productsService.getImages(product.id);
    }

    @ResolveField(() => [ProductVariant])
    async variants(@Parent() product: Product) {
        return this.productsService.getVariants(product.id);
    }

    @ResolveField(() => Category, { nullable: true })
    async category(@Parent() product: Product) {
        return this.productsService.getCategory((product as any).category);
    }

    @ResolveField(() => Boolean)
    outOfStock(@Parent() product: Product): boolean {
        return product.stock <= 0;
    }

    @ResolveField(() => Boolean)
    isLowStock(@Parent() product: Product): boolean {
        return product.stock > 0 && product.stock <= 5;
    }
}
