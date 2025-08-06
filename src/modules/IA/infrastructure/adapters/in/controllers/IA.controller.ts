import { Controller, Post, Body } from '@nestjs/common';

import { PromptUseCase } from '../../../../application/use-cases/prompt.use-case';

@Controller('ia')
export class IAController {
  constructor(private readonly promptUseCase: PromptUseCase) {}

  @Post('chat')
  async prompt(@Body() prompt: string): Promise<string | null> {
    return this.promptUseCase.execute(prompt);
  }
}
