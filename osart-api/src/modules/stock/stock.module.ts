import { Module } from '@nestjs/common';
import { StockService } from './stock.service';
import { StockResolver } from './stock.resolver';
import { PubSubModule } from '../../common/pubsub/pubsub.module';

@Module({
    imports: [PubSubModule],
    providers: [StockService, StockResolver],
    exports: [StockService],
})
export class StockModule { }
