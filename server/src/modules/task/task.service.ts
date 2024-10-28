import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { FeedsService } from '../feeds/feeds.service';

@Injectable()
export class TaskService {

  private readonly logger = new Logger(TaskService.name);

  constructor(
    private feedsService: FeedsService
  ) { }

  // every 2 hours fetch all new feeds from source
  @Cron(CronExpression.EVERY_10_MINUTES, {
    name: 'fetchNewFeeds',
    timeZone: 'Asia/Dhaka'
  })
  fetchNewFeeds() {
    this.logger.debug("Fetching new feeds from source...")
    this.feedsService.getFeedsFromSource();
    this.logger.debug("Finished fetching new feeds from source...")
  }


}
