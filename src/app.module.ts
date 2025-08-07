import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import mikroOrmConfig from './config/mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { IAModule } from './modules/IA/IA.module';
import { FoodsModule } from './modules/foods/foods.module';
import { FoodCategoriesModule } from './modules/food-categories/food-categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MikroOrmModule.forRootAsync({
      useFactory: () => mikroOrmConfig,
    }),
    FoodsModule,
    FoodCategoriesModule,
    IAModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
