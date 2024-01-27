import Link from "next/link";
import { AlertCircle } from "lucide-react";

/* eslint-disable @next/next/no-img-element */
interface MovieCardProps {
  poster_path: string | undefined;
  id: number;
  rating?: number;
  title: string;
}

const MovieCard = (props: MovieCardProps) => {
  const { poster_path, id, title } = props;
  return (
    <Link href={`/movie/${id}`}>
      <div className="flex h-[330px] w-[240px] content-center justify-center">
        {poster_path ? (
          <img
            src={`https://image.tmdb.org/t/p/w500${poster_path}`}
            alt={`Poster for ${title} `}
            className="h-[330px] w-[240px]"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center space-y-2 bg-gray-200">
            <AlertCircle color="#dc2626" size={64} />
            <p className="text-center">No poster available</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default MovieCard;
