import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import { Movie, SearchResponse } from "~/types";

export const movieRouter = createTRPCRouter({
  search: publicProcedure
    .input(z.object({ query: z.string() }))
    .query(async ({ input }) => {
      const options = {
        method: "GET",
        headers: {
          accept: "application/json",
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIyMWNjNTE3ZDBiYWQ1NzIxMjBkMTY2MzYxM2IzYTFhNyIsInN1YiI6IjYxZjcyYjkxZmU2YzE4MDAxYjBiYzliYiIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.FfWpNwmn2t_Jmxjs9s-J8Irj0TW5KBv_58WwTkVRKgQ",
        },
      };

      let movies: Movie[] = [];

      await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${input.query}&include_adult=true&language=en-US&page=1`,
        options,
      )
        .then((response) => response.json())
        .then((response: SearchResponse) => (movies = response.results))
        .catch((err) => console.error(err));

      return movies;
    }),

  create: publicProcedure
    .input(z.object({ name: z.string().min(1) }))
    .mutation(async ({ ctx, input }) => {
      // simulate a slow db call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      return ctx.db.post.create({
        data: {
          name: input.name,
        },
      });
    }),

  getLatest: publicProcedure.query(({ ctx }) => {
    return ctx.db.post.findFirst({
      orderBy: { createdAt: "desc" },
    });
  }),
});
