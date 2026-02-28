import { Controller, Get, Param, Query } from '@nestjs/common';
import { ProductsService } from './products.service';

@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Get()
    async findAll(@Query('limit') limit?: number) {
        // Basic implementation to match what the frontend needs for Related Products
        return this.productsService.findAll({ limit: limit ? Number(limit) : 10 });
    }

    @Get('slug/:slug')
    async findBySlug(@Param('slug') slug: string) {
        return this.productsService.findBySlug(slug);
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return this.productsService.findOne(id);
    }
}
