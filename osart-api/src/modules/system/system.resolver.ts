import { Query, Resolver } from '@nestjs/graphql';
import { SystemService } from './system.service';
import { DatabaseStatus } from './models/database-status.model';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../../common/guards/gql-auth.guard';

@Resolver()
// @UseGuards(GqlAuthGuard)
export class SystemResolver {
    constructor(private readonly systemService: SystemService) { }

    @Query(() => DatabaseStatus)
    async adminDatabaseStatus(): Promise<DatabaseStatus> {
        return this.systemService.getDatabaseStatus();
    }
}
