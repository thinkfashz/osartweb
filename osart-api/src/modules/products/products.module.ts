import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { PubSubModule } from '../../common/pubsub/pubsub.module';

@Module({
    imports: [PubSubModule],
    providers: [ProductsService, ProductsResolver],
    exports: [ProductsService],
})
export class ProductsModule { }
