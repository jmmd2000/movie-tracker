import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import MovieCard from "~/components/ui/MovieCard";
import BarLoader from "react-spinners/BarLoader";

import { api } from "~/utils/api";
import { Movie } from "~/types";
import { set } from "zod";
import { Frown } from "lucide-react";

export default function Home() {
  const router = useRouter();
  const [inputValue, setInputValue] = useState(""); // State for the input field
  const [searchQuery, setSearchQuery] = useState(""); // State for the search query
  const [movies, setMovies] = useState<Movie[]>([]); // All loaded items
  const [page, setPage] = useState(1); // Current page
  const loader = useRef(null); // Element to trigger loading of further pages

  const { data, isLoading, isError } = api.movie.search.useQuery({
    query: searchQuery,
    page,
  });

  // Update input and search query when the URL changes
  useEffect(() => {
    const query = router.query.search as string;
    if (query) {
      setInputValue(query);
      setSearchQuery(query);
      setPage(1);
    }
  }, [router.query.search]);

  // Handle the search action
  const handleSearch = () => {
    setMovies([]); // Reset the items
    setPage(1); // Reset the page
    setSearchQuery(inputValue); // Update the search query to trigger the search
    void router.push(`/?search=${encodeURIComponent(inputValue)}`, undefined, {
      shallow: true,
    });
  };

  // Handle "Enter" key press in the input
  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch();
    }
  };

  useEffect(() => {
    const options = {
      root: null, // relative to the viewport
      rootMargin: "0px",
      threshold: 1.0, // the callback will be run when the element is fully visible
    };

    const observer = new IntersectionObserver(handleObserver, options);

    if (loader.current) {
      observer.observe(loader.current); // Start observing the loader element
    }

    return () => {
      if (loader.current) {
        observer.unobserve(loader.current); // Clean up observer when component unmounts or loader changes
      }
    };
  }, []); // Empty dependency a

  // Handle intersection with the bottom element
  const handleObserver = (entities: IntersectionObserverEntry[]) => {
    const target = entities[0];
    if (target?.isIntersecting) {
      setPage((prevPage) => {
        console.log("Current page:", prevPage); // Log the current page before incrementing
        return prevPage + 1;
      });
    }
  };

  // Append new items when data is fetched
  useEffect(() => {
    console.log("movies", movies);
    if (data) {
      setMovies((prevMovies) => [...prevMovies, ...data]);
    }
  }, [data]);

  return (
    <main>
      <div className="m-auto flex w-full max-w-sm items-center space-x-2 p-4">
        <Input
          type="text"
          placeholder="Search for a movie..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyPress}
        />
        <Button onClick={handleSearch}>Search</Button>
      </div>
      <div>
        {movies && (
          <div className="grid grid-cols-7 justify-items-center gap-y-5">
            {movies?.map((movie, index) => (
              <MovieCard
                key={index}
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
        {/* If no movies found at all */}
        {data && data.length === 0 && movies.length === 0 && (
          <div className="row my-5 flex w-full flex-col items-center justify-center space-y-2">
            <Frown size={48} />
            <p>No movies found</p>
          </div>
        )}
        {/* If there were movies found, but you reached the end */}
        {data && data.length === 0 && movies.length > 0 && (
          <div className="my-5 flex w-full flex-col items-center justify-center space-y-2">
            <Frown size={48} />
            <p>No more movies found</p>
          </div>
        )}
      </div>

      <div ref={loader} style={{ height: "100px", width: "100%" }} />
    </main>
  );
}
