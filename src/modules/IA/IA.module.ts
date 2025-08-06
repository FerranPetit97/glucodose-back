import { Module } from '@nestjs/common';

import { PromptUseCase } from './application/use-cases/prompt.use-case';

import { IAController } from './infrastructure/adapters/in/controllers/IA.controller';

@Module({
  imports: [],
  providers: [PromptUseCase],
  controllers: [IAController],
  exports: [PromptUseCase],
})
export class IAModule {}
