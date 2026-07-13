import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  // Creates the NestJS application instance
  const app = await NestFactory.create(AppModule);

  // Starts the HTTP and WebSocket servers simultaneously on port 3000
  await app.listen(3000);
  console.log('\n[NestJS] 🚀 Server is running on http://localhost:3000');
  console.log('[NestJS] 📡 WebSocket gateway is listening for connections...');
}
bootstrap();
