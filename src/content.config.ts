import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const blog = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/content/blog" }),
  schema: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
    category: z.string().min(1),
    date: z.iso.date(),
    image: z.string().startsWith("/images/"),
    imageAlt: z.string().min(1),
    order: z.number().int().positive(),
    showPriceTable: z.boolean().default(false),
  }),
});

export const collections = { blog };
