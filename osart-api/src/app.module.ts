import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ApolloServerPluginLandingPageLocalDefault } from '@apollo/server/plugin/landingPage/default';
import { join } from 'path';

import { ProductsModule } from './modules/products/products.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { CartModule } from './modules/cart/cart.module';
import { OrdersModule } from './modules/orders/orders.module';
import { WishlistModule } from './modules/wishlist/wishlist.module';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CouponsModule } from './modules/coupons/coupons.module';
import { PaymentsModule } from './modules/payments/payments.module';
import { StockModule } from './modules/stock/stock.module';
import { UsersModule } from './modules/users/users.module';
import { SeedModule } from './modules/seed/seed.module';
import { SystemModule } from './modules/system/system.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      // In Vercel/Production, write to /tmp or use true for in-memory to avoid EROFS
      autoSchemaFile: (process.env.VERCEL || process.env.NODE_ENV === 'production')
        ? join('/tmp', 'schema.gql')
        : join(process.cwd(), 'src/schema.gql'),
      sortSchema: true,
      introspection: true,
      plugins: [
        ApolloServerPluginLandingPageLocalDefault({ embed: true }),
      ],
    }),
    ProductsModule,
    CategoriesModule,
    CartModule,
    OrdersModule,
    WishlistModule,
    CouponsModule,
    PaymentsModule,
    StockModule,
    UsersModule,
    SeedModule,
    SystemModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
