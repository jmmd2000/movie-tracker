/* eslint-disable @next/next/no-img-element */
interface MovieCardProps {
  poster_path: string | undefined;
  id: number;
  rating?: number;
  title: string;
}

const MovieCard = (props: MovieCardProps) => {
  const { poster_path, id, rating, title } = props;
  return (
    <div>
      <img
        src={`https://image.tmdb.org/t/p/w500${poster_path}`}
        alt={`Poster for ${title} `}
      />
    </div>
  );
};

export default MovieCard;
