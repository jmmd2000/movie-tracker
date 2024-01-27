/* eslint-disable @next/next/no-img-element */
import { useRouter } from "next/router";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "~/components/ui/carousel";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
// import { useUser } from "@clerk/nextjs";
import { api } from "~/utils/api";

export default function MovieDetailPage() {
  const router = useRouter();
  // const user = useUser();
  const movieID = router.query.id;
  const {
    data: movie,
    // isLoading,
    // isSuccess,
    // refetch,
  } = api.movie.getByID.useQuery(parseInt(movieID as string));

  const { data: images } = api.movie.getImagesByID.useQuery(
    parseInt(movieID as string),
  );

  console.log(movie);
  console.log(images);

  return (
    <main>
      <section>
        <h1>{movie?.title}</h1>
        <p>{movie?.overview}</p>
      </section>
      <section className="flex w-full flex-col items-center justify-center">
        <h2>Images</h2>
        <Carousel className="w-[80%]">
          <CarouselContent>
            {images?.backdrops?.map((image) => (
              <CarouselItem
                className="md:basis-1/2 lg:basis-1/3"
                key={image.file_path}
              >
                <ImageDialog image={image.file_path} title={movie?.title}>
                  <img
                    src={`https://image.tmdb.org/t/p/w500${image.file_path}`}
                    alt={`Backdrop for ${movie?.title}`}
                  />
                </ImageDialog>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>
    </main>
  );
}

interface ImageDialogProps {
  image: string;
  title: string | undefined;
  children: React.ReactNode;
}

const ImageDialog = (props: ImageDialogProps) => {
  const { image, title, children } = props;
  return (
    <Dialog>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="flex items-center justify-center">
        <img
          src={`https://image.tmdb.org/t/p/w500${image}`}
          alt={`Backdrop for ${title}`}
          className="m-3"
        />
      </DialogContent>
    </Dialog>
  );
};
