import { defineCollection, z } from "astro:content";

const mindCollection = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    createdDate: z.coerce.date(),
    updatedDate: z.coerce.date(),
    hashtags: z.array(z.string()),
    status: z.enum(["active", "archived", "draft"]).default("active"),
    thoughts: z.array(
      z.object({
        id: z.string(),
        date: z.coerce.date(),
        content: z.string(),
        hashtags: z.array(z.string()).optional(),
        editedDate: z.coerce.date().optional(),
      })
    ),
    changelog: z.array(
      z.object({
        date: z.coerce.date(),
        action: z.enum([
          "created",
          "thought_added",
          "thought_edited",
          "thought_deleted",
          "hashtag_added",
          "hashtag_removed",
          "status_changed",
          "updated",
          "tagged",
        ]),
        description: z.string().optional(),
        thoughtId: z.string().optional(),
      })
    ),
  }),
});

export const collections = {
  mind: mindCollection,
};
