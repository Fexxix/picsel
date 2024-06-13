"use client";

import { Button } from "@/components/ui/button";
import { Loader, Trash } from "lucide-react";
import { Masonry } from "react-plock";
import { deleteImage } from "../actions";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import Lightbox, { type CaptionsRef } from "yet-another-react-lightbox";
import { useCallback, useEffect, useRef, useState } from "react";
import { Fullscreen, Captions } from "yet-another-react-lightbox/plugins";
import { Img } from "react-image";

import "yet-another-react-lightbox/styles.css";
import "yet-another-react-lightbox/plugins/captions.css";

type Image = {
  name: string;
  url: string;
  id: string;
};

export function MasonryGrid(props: { images: Image[] }) {
  const { images } = props;
  const [index, setIndex] = useState(-1);
  const hideCaptions = useRef(false);

  const handleCaptionsRef = useCallback((captionsRef: CaptionsRef | null) => {
    if (captionsRef && hideCaptions.current) {
      hideCaptions.current = false;
      captionsRef.hide();
    }
  }, []);

  return (
    <>
      <Masonry
        items={images.map((image, index) => ({ image, index }))}
        config={{
          columns: [1, 2, 3, 4, 5],
          gap: [24, 12, 6, 3, 3],
          media: [640, 768, 1024, 1280, 1536],
        }}
        render={({ image, index }) => (
          <ImageCard
            key={image.id}
            image={image}
            index={index}
            setIndex={setIndex}
          />
        )}
      />
      <Lightbox
        index={index}
        plugins={[Fullscreen, Captions]}
        captions={{ ref: handleCaptionsRef, showToggle: true }}
        on={{
          entering: () => {
            hideCaptions.current = true;
          },
        }}
        slides={images.map((image) => ({
          src: image.url,
          alt: image.name,
          title: image.name,
        }))}
        open={index >= 0}
        close={() => setIndex(-1)}
      />
    </>
  );
}

function ImageCard(props: {
  image: Image;
  index: number;
  setIndex: React.Dispatch<React.SetStateAction<number>>;
}) {
  const { image, index, setIndex } = props;

  const pathname = usePathname();

  const collectionId = pathname?.split("/")[2];

  return (
    <div
      onClick={() => setIndex(index)}
      className="group relative cursor-pointer overflow-hidden shadow-lg transition-all duration-300 ease-in-out hover:shadow-xl"
    >
      <Img
        src={image.url}
        loader={
          <div className="flex h-40 w-40 items-center justify-center">
            <Loader className="relative z-10 animate-spin" />
          </div>
        }
        alt={image.name}
        className="w-full object-cover transition-transform duration-300 ease-in-out"
      />
      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-4 text-white opacity-0 transition-all duration-300 ease-in-out group-hover:translate-y-0 group-hover:opacity-100">
        <h3 className="truncate text-lg font-bold">{image.name}</h3>
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="absolute right-2 top-2 z-10 rounded-full bg-white/70 opacity-0 transition-all duration-300 ease-in-out hover:bg-red-400 hover:text-white group-hover:opacity-100 dark:bg-gray-950/70 dark:hover:bg-red-500"
        onClick={async () => {
          try {
            toast.loading("Deleting...", {
              id: "deleting-image",
            });

            await deleteImage({
              imageId: image.id,
              collectionId,
            });

            toast.success("Deleted!");
          } catch (e) {
            if (e instanceof Error) {
              toast.error(e.message);
            }
          } finally {
            toast.dismiss("deleting-image");
          }
        }}
      >
        <Trash className="h-4 w-4" />
        <span className="sr-only">Delete</span>
      </Button>
    </div>
  );
}
