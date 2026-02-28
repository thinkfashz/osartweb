import { Module } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductsResolver } from './products.resolver';
import { ProductsController } from './products.controller';
import { PubSubModule } from '../../common/pubsub/pubsub.module';

@Module({
    imports: [PubSubModule],
    controllers: [ProductsController],
    providers: [ProductsService, ProductsResolver],
    exports: [ProductsService],
})
export class ProductsModule { }
