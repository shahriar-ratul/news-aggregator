import { Controller, Get } from '@nestjs/common';
import { FeedsService } from './feeds.service';


@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}

  @Get()
  findAll() {
    return this.feedsService.getFeeds();
  }



}
