import { z } from "zod";
import { authRouter } from "./auth-router";
import { publicProcedure, router } from "./trpc";
import { queryValidtor } from "../lib/validator";
import { getPayloadClient } from "../get-payload";

export const appRouter = router({
  auth: authRouter,
  getInfiniteProducts: publicProcedure
    .input(
      z.object({
        limit: z.number().min(1).max(100),
        cursor: z.number().nullish(),
        query: queryValidtor,
      })
    )
    .query(async ({ input }) => {
      const { query, cursor } = input;
      const { limit, sort, ...queryOptions } = query;
      const payload = await getPayloadClient();
      const parsedQueryOptns: Record<string, { equals: string }> = {};
      Object.entries(queryOptions).forEach(([key, value]) => {
        parsedQueryOptns[key] = {
          equals: value,
        };
      });
      const page = cursor || 1;
      const {
        docs: items,
        hasNextPage,
        nextPage,
      } = await payload.find({
        collection: "products",
        where: {
          approvedForSale: {
            equals: "approved",
          },
          ...parsedQueryOptns,
        },
        sort,
        depth: 1,
        limit,
        page,
      });
      return {
        items,
        nextPage: hasNextPage ? nextPage : null,
      };
    }),
});

export type AppRouter = typeof appRouter;
