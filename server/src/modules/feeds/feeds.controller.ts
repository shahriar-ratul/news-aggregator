import { Controller, Get } from '@nestjs/common';
import { FeedsService } from './feeds.service';
import { ApiResponse } from '@nestjs/swagger';


@Controller('feeds')
export class FeedsController {
  constructor(private readonly feedsService: FeedsService) {}


  @Get('fetch')
  @ApiResponse({})
  fetchNewFeeds() {
    return this.feedsService.getFeedsFromSource();
  }

  @Get('all-sources')
  @ApiResponse({})
  async getAllSources() {
    return this.feedsService.getAllSources();
  }






}
