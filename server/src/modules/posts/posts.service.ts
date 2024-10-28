import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PageDto, PageMetaDto, PageOptionsDto } from 'src/core/dto';
import { Feed, Prisma } from '@prisma/client';

@Injectable()
export class PostsService {

  private readonly logger = new Logger(PostsService.name);

  constructor(private _prisma: PrismaService) { }


  async findAll(query: PageOptionsDto): Promise<PageDto<Feed>> {
    const limit: number = query.limit || 10;
    const page: number = query.page || 1;
    const skip: number = (page - 1) * limit;
    const search = query.search || '';

    const sort = query.sort || 'id';

    const order = query.order || 'asc';

    // Add debug logs
    this.logger.log(`Raw query.source: ${JSON.stringify(query.source)}`);
    this.logger.log(`Type of query.source: ${typeof query.source}`);

    let sources: string[] = [];

    if (query.source) {
      if (typeof query.source === 'string') {
        try {
          sources = JSON.parse(query.source);
          this.logger.log('Parsed from JSON string:', sources);
        } catch {
          sources = [query.source];
          this.logger.log('Used as single string:', sources);
        }
      } else if (Array.isArray(query.source)) {
        sources = query.source;
        this.logger.log('Used as array directly:', sources);
      }
    }

    this.logger.log(`Final sources: ${JSON.stringify(sources)}`);

    if (sources.length > 0) {
      this.logger.log(`Sources: ${sources}`);
    }


    const queryData: Prisma.FeedFindManyArgs = {
      where: {
        OR: [
          { title: { contains: search } },
        ],
        ...(sources.length > 0 && {
          urlId: {
            in: sources
          }
        })
      },
      include: {
        url: true
      },
      take: limit,
      skip: skip,
      orderBy: {
        [sort]: order.toLowerCase(),
      },
    };
    const [items, count] = await this._prisma.$transaction([
      this._prisma.feed.findMany(queryData),
      this._prisma.feed.count({ where: queryData.where })
    ]);
    const pageOptionsDto = {
      limit: limit,
      page: page,
      skip: skip,
    };


    const pageMetaDto = new PageMetaDto({
      total: count,
      pageOptionsDto: pageOptionsDto,
    });


    return new PageDto(items, pageMetaDto);

  }

  async findOne(id: number): Promise<{ message: string, item: Feed }> {
    const item = await this._prisma.feed.findUnique({
      where: {
        id: id,
      },
      include: {
        url: true
      }
    });

    if (!item) {
      throw new HttpException('Post not found', HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Post fetched successfully',
      item: item,
    };
  }


}
