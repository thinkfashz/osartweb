import { Resolver, Query, Mutation, Args, Int, Subscription } from '@nestjs/graphql';
import { StockService } from './stock.service';
import { StockMovement } from './models/stock-movement.model';
import { UpdateStockInput, StockMovementFilterInput } from './dto/stock.input';
import { Product } from '../products/models/product.model';

@Resolver()
export class StockResolver {
    constructor(private readonly stockService: StockService) { }

    @Mutation(() => Product)
    async adminUpdateStock(@Args('input') input: UpdateStockInput) {
        return this.stockService.updateStock(input);
    }

    @Query(() => [StockMovement])
    async adminStockMovements(@Args('filter', { nullable: true }) filter?: StockMovementFilterInput) {
        return this.stockService.getMovements(filter || {});
    }

    @Query(() => [Product])
    async adminLowStockAlerts(@Args('threshold', { type: () => Int, nullable: true, defaultValue: 3 }) threshold: number) {
        return this.stockService.getLowStockProducts(threshold);
    }
}
