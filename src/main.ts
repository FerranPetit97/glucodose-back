import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import axios from 'axios';

async function checkIA(model: string): Promise<void> {
  try {
    const res = await axios.post<{ response?: string }>(
      `${process.env.IA_URL}/api/generate`,
      {
        model,
        prompt:
          'Respondeme solo con el número con 21 decimales de pi.',
        stream: false,
      },
    );

    const respuesta = res.data?.response?.trim();
    if (respuesta) {
      console.log(`✅ IA activa. Modelo "${model}" respondió: "${respuesta}"`);
    } else {
      console.warn(`⚠️ IA activa. Modelo "${model}" no devolvió respuesta.`);
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        `❌ Error al conectar con Ollama o el modelo "${model}" no está disponible.`,
      );
      console.error('Detalle:', error.message);
    } else {
      console.error(
        `❌ Error al conectar con Ollama o el modelo "${model}" no está disponible.`,
      );
      console.error('Detalle:', error);
    }
  }
}

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);

    const configService = app.get(ConfigService);
    const model = configService.get<string>('IA_MODEL') || 'phi';

    const config = new DocumentBuilder()
      .setTitle('API ejemplo')
      .setDescription('Documentación API con Swagger')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);

    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true,
        transform: true,
      }),
    );

    const port = configService.get<string>('PORT') || 3000;

    await app.listen(port);

    await checkIA(model);

    console.log(`🚀 App running on http://localhost:${port}`);
  } catch (error) {
    console.error('Error during application bootstrap:', error);
    process.exit(1);
  }
}
bootstrap();
