import { Injectable, Logger } from '@nestjs/common';
import { feedUrls } from 'src/core/constants';
import { PrismaService } from '../prisma/prisma.service';
import * as Parser from 'rss-parser';
import { generateSlug } from 'src/core/helpers/GenerateHelpers';

@Injectable()
export class FeedsService {

  private userAgents = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/119.0',
    'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/605.1.15',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Firefox/119.0',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Safari/605.1.15',
  ];

  private parser = new Parser({
    headers: {
      'User-Agent': this.getRandomUserAgent(),
    },
  });

  constructor(
    private readonly _prisma: PrismaService,
  ) { }

  async getFeedsFromSource() {
    try {
      const promises = feedUrls.map(async (feedUrl) => {
        const feeds = await this.getFeedsFromUrl(feedUrl);
        if (!feeds) return null;

        // Update URL with feed metadata
        await this._prisma.url.upsert({
          where: { url: feedUrl },
          create: {
            url: feedUrl,
            slug: generateSlug(feedUrl),
            title: feeds.title || null,
            description: feeds.description || null,
            language: feeds.language || null,
            copyright: feeds.copyright || null,
            lastBuildDate: feeds.lastBuildDate ? new Date(feeds.lastBuildDate) : null,
            publishDate: feeds.pubDate ? new Date(feeds.pubDate) : null,
          },
          update: {
            title: feeds.title || null,
            description: feeds.description || null,
            language: feeds.language || null,
            copyright: feeds.copyright || null,
            lastBuildDate: feeds.lastBuildDate ? new Date(feeds.lastBuildDate) : null,
            publishDate: feeds.pubDate ? new Date(feeds.pubDate) : null,
          }
        });

        const sourceUrl = await this._prisma.url.findUnique({
          where: { url: feedUrl }
        });

        // Save feeds with correct URL relationship
        const feedPromises = feeds.items.map(item =>
          this.saveFeed(item, sourceUrl.id)
        );

        return Promise.all(feedPromises);
      });

      const results = await Promise.all(promises);

      // Filter out failed requests
      const validResults = results.filter(result => result !== null);


      return {
        message: 'Feeds fetched and saved successfully',
        validResults: validResults
      };
    } catch (error) {
      Logger.error(`Error fetching feeds: ${error.message}`);
      throw error;
    }
  }

  async getFeedsFromUrl(url: string) {
    try {
      const feed = await this.parser.parseURL(url);

      return feed;
    } catch (error) {
      Logger.error(`Error fetching feed from ${url}: ${error.message}`);
      return null;
    }
  }

  async saveFeed(feed: any, sourceUrlId: string) {
    try {

      const existingFeed = await this._prisma.feed.findFirst({
        where: {
          link: feed.link,
        }
      });

      if (existingFeed) {
        return existingFeed;
      }

      await this._prisma.feed.create({
        data: {
          title: feed.title,
          url: {
            connect: {
              id: sourceUrlId // Connect to the source URL
            }
          },
          link: feed.link || null,

          content: feed.content || null,
          contentSnippet: feed.contentSnippet || null,
          publishedAt: feed.pubDate ? new Date(feed.pubDate) : feed.isoDate ? new Date(feed.isoDate) : null,
          source: feed.source || null,
          creator: feed.creator || null,
          categories: feed.categories ? JSON.stringify(feed.categories) : null,
          isoDate: feed.isoDate || null,
        }
      });
    } catch (error) {
      Logger.error(`Error saving feed: ${error.message}`);
      return null;
    }
  }


  private getRandomUserAgent(): string {
    return this.userAgents[Math.floor(Math.random() * this.userAgents.length)];
  }
}
