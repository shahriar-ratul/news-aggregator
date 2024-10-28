import { Controller, Get, Param, Query, } from '@nestjs/common';
import { PostsService } from './posts.service';
import { ApiResponse } from '@nestjs/swagger';
import { PageDto, PageOptionsDto } from 'src/core/dto';
import { Feed } from '@prisma/client';

@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}


  @Get()
  @ApiResponse({})
  async findAll(
    @Query() pageOptionsDto: PageOptionsDto,
  ): Promise<PageDto<Feed>> {
    return this.postsService.findAll(pageOptionsDto);
  }

  @ApiResponse({})
  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.postsService.findOne(+id);
  }

}
