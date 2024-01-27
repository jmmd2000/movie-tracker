import { env } from "process";
import { z } from "zod";

import { createTRPCRouter, publicProcedure } from "~/server/api/trpc";
import {
  MovieDetails,
  MovieImages,
  type Movie,
  type SearchResponse,
} from "~/types";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: "Bearer " + env.BEARER_TOKEN!,
  },
};

export const movieRouter = createTRPCRouter({
  search: publicProcedure
    .input(
      z.object({
        query: z.string(),
        page: z.number().optional(),
      }),
    )
    .query(async ({ input }) => {
      const { query, page } = input;
      let movies: Movie[] = [];

      await fetch(
        `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=true&language=en-US&page=${page}`,
        options,
      )
        .then((response) => response.json())
        .then((response: SearchResponse) => (movies = response.results))
        .catch((err) => console.error(err));

      return movies;
    }),
  getByID: publicProcedure.input(z.number()).query(async ({ input }) => {
    return fetch(
      `https://api.themoviedb.org/3/movie/${input}?language=en-US`,
      options,
    )
      .then((response) => response.json())
      .then((response: MovieDetails) => {
        if (!response) {
          throw new Error("Movie not found");
        }
        return response;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }),

  getImagesByID: publicProcedure.input(z.number()).query(async ({ input }) => {
    return fetch(`https://api.themoviedb.org/3/movie/${input}/images`, options)
      .then((response) => response.json())
      .then((response: MovieImages) => {
        if (!response) {
          throw new Error("Movie not found");
        }
        console.log(response);
        return response;
      })
      .catch((err) => {
        console.error(err);
        throw err;
      });
  }),
});
