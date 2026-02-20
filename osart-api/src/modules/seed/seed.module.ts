import { Module } from '@nestjs/common';
import { SeedService } from './seed.service';
import { SeedResolver } from './seed.resolver';

@Module({
    providers: [SeedService, SeedResolver],
})
export class SeedModule { }
