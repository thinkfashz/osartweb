import * as dotenv from 'dotenv';
dotenv.config();
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

export async function createApp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: process.env.CORS_ORIGIN ?? '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });
  return app;
}

// Local dev: only listen() when NOT in a serverless environment
if (process.env.VERCEL !== '1') {
  async function bootstrap() {
    const app = await createApp();
    const port = process.env.PORT ?? 3001;
    await app.listen(port);
    console.log(`[OSART API] Running on http://localhost:${port}`);
    console.log(`[OSART API] GraphQL → http://localhost:${port}/graphql`);
  }
  bootstrap();
}
