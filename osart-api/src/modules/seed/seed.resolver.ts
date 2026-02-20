import { Resolver, Mutation } from '@nestjs/graphql';
import { SeedService } from './seed.service';
import { GraphQLJSONObject } from 'graphql-scalars';

@Resolver()
export class SeedResolver {
    constructor(private readonly seedService: SeedService) { }

    @Mutation(() => GraphQLJSONObject)
    async adminSeedDemoData() {
        return this.seedService.seedDemoData();
    }
}
