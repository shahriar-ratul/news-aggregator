import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedModule } from './modules/feed/feed.module';
import { FeedsModule } from './modules/feeds/feeds.module';

@Module({
  imports: [FeedModule, FeedsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
