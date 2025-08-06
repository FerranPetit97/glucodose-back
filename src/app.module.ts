import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MikroOrmModule } from '@mikro-orm/nestjs';

import mikroOrmConfig from './config/mikro-orm.config';
import { FoodModule } from './modules/food/food.module';
import { AppService } from './app.service';
import { AppController } from './app.controller';
import { IAModule } from './modules/IA/IA.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env.${process.env.NODE_ENV || 'development'}`,
    }),
    MikroOrmModule.forRootAsync({
      useFactory: async () => mikroOrmConfig,
    }),
    FoodModule,
    IAModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
