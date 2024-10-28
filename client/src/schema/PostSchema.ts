import { z } from 'zod';

export const Post = z.object({
    id: z.number(),
    urlId: z.string(),
    title: z.string(),
    creator: z.string(),
    link: z.string(),
    content: z.string(),
    contentSnippet: z.string(),
    publishedAt: z.string(),
    source: z.null(),
    categories: z.string(),
    isoDate: z.string(),
    createdAt: z.string(),
    updatedAt: z.string()
})

export type PostModel = z.infer<typeof Post>;
