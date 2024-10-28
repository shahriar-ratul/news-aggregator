import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FeedsModule } from './modules/feeds/feeds.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { TaskModule } from './modules/task/task.module';
import { ScheduleModule } from '@nestjs/schedule';
import { PostsModule } from './modules/posts/posts.module';

@Module({
  imports: [
    FeedsModule,
    PrismaModule,
    TaskModule,
    ScheduleModule.forRoot(),
    PostsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
