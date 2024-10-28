import { Module } from '@nestjs/common';
import { TaskService } from './task.service';
import { FeedsModule } from '../feeds/feeds.module';


@Module({
  imports: [FeedsModule],
  controllers: [],
  providers: [TaskService],
})
export class TaskModule { }
