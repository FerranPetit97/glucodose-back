import { Injectable } from '@nestjs/common';
import axios from 'axios';

@Injectable()
export class PromptUseCase {
  private readonly IA_URL = `${process.env.IA_URL}/api/generate`;

  async execute(prompt: string): Promise<string> {
    const response = await axios.post(this.IA_URL, {
      model: process.env.IA_MODEL,
      prompt: `Responde en español: ${prompt}`,
      stream: false,
    });

    return response.data.response;
  }
}
