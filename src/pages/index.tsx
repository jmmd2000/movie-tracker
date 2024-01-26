import Head from "next/head";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import MovieCard from "~/components/ui/MovieCard";
import BarLoader from "react-spinners/BarLoader";

import { api } from "~/utils/api";

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const { data, isLoading, isError, refetch } = api.movie.search.useQuery(
    {
      query: searchQuery,
    },
    {
      enabled: false,
    },
  );

  useEffect(() => {
    if (data) {
      console.log(data);
    }
  }, [data]);

  return (
    <main>
      <div className="m-auto flex w-full max-w-sm items-center space-x-2 p-4">
        <Input
          type="text"
          placeholder="Search for a movie..."
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={() => refetch()}>Search</Button>
      </div>
      {data && (
        <div className="grid grid-cols-6 gap-1">
          {data?.map((movie) => (
            <MovieCard
              key={movie.id}
              poster_path={movie.poster_path}
              id={movie.id}
              title={movie.title}
            />
          ))}
        </div>
      )}
      {isLoading && (
        <div className="flex w-full items-center justify-center">
          <BarLoader color="#18181b" />
        </div>
      )}
      {isError && <div>Something went wrong</div>}
    </main>
  );
}
