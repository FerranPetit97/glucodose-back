import { Controller, Post, Body } from '@nestjs/common';

import { PromptUseCase } from '../../../../application/use-cases/prompt.use-case';

@Controller('ia')
export class IAController {
  constructor(private readonly promptUseCase: PromptUseCase) {}

  @Post('chat')
  async prompt(@Body() body: { prompt: string }): Promise<string | null> {
    const prompt = body.prompt;

    return this.promptUseCase.execute(prompt);
  }
}
