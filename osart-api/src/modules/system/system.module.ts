import { Module } from '@nestjs/common';
import { SystemService } from './system.service';
import { SystemResolver } from './system.resolver';

@Module({
    providers: [SystemService, SystemResolver],
    exports: [SystemService],
})
export class SystemModule { }
