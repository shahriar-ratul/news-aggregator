import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedsModule } from './modules/feeds/feeds.module';
import { PrismaModule } from './modules/prisma/prisma.module';

@Module({
  imports: [FeedsModule, PrismaModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
