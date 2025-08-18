import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';

import mikroOrmConfig from './config/mikro-orm.config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import { AppService } from './app.service';
import { AppController } from './app.controller';
import { GlobalExceptionFilter } from './common/filters/global-exception.filter';

import { IAModule } from './modules/IA/IA.module';
import { FoodsModule } from './modules/foods/foods.module';
import { FoodCategoriesModule } from './modules/food-categories/food-categories.module';
import { PatientsModule } from './modules/patients/patients.module';

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
    PatientsModule,
    IAModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class AppModule {}
