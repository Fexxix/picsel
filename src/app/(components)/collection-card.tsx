import { cn } from "@/lib/utils";
import { getMyCollections } from "@/server/queries";
import Link from "next/link";
import { CollectionActionButtons } from "./collection-action-buttons";

export function CollectionCard(props: {
  collection: Awaited<ReturnType<typeof getMyCollections>>[number];
}) {
  const { collection } = props;

  return (
    <div className="group relative overflow-hidden rounded-lg">
      <div className="group relative overflow-hidden rounded-lg">
        <div className="absolute right-4 top-4 z-20 flex items-center gap-2 opacity-0 transition-opacity group-hover:opacity-100">
          <CollectionActionButtons
            collectionId={collection.id}
            imagesRef={collection.images.map((id) => id.toString())}
            name={collection.name}
            description={collection.description}
          />
        </div>
        <Link
          href={`/collections/${collection.id}`}
          className="contents"
          prefetch={false}
        >
          <div className="absolute inset-0 z-10 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-4 transition-colors group-hover:from-black/90">
            <h3 className="text-lg font-semibold text-white">
              {collection.name}
            </h3>
            {collection.description && (
              <p className="text-sm text-gray-300 dark:text-gray-400">
                {collection.description}
              </p>
            )}
            <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
              Created{" "}
              {collection.createdAt.toLocaleDateString(undefined, {
                dateStyle: "long",
              })}
            </div>
          </div>
          <img
            src={collection.thumbnail || "/placeholder.svg"}
            alt="Landscapes Collection"
            width={400}
            height={300}
            className={cn("h-60 w-full object-cover", {
              "dark:invert": !collection.thumbnail,
            })}
          />
        </Link>
      </div>
    </div>
  );
}
