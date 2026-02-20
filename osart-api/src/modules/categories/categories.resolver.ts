import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { Category } from './models/category.model';
import { CategoriesService } from './categories.service';

@Resolver(() => Category)
export class CategoriesResolver {
    constructor(private readonly service: CategoriesService) { }

    @Query(() => [Category])
    async categories() {
        return this.service.list();
    }

    @Query(() => Category)
    async categoryBySlug(@Args('slug') slug: string) {
        return this.service.bySlug(slug);
    }

    @Mutation(() => Category)
    async createCategory(@Args('name') name: string) {
        return this.service.create(name);
    }
}
