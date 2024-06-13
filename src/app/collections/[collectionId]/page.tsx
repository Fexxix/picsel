import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { getCollectionImages, getMyCollections } from "@/server/queries";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { ImageUploadButton } from "./(components)/image-upload-button";
import { MasonryGrid } from "./(components)/masonry-grid";

export default async function Page({
  params,
}: {
  params: { collectionId: string };
}) {
  const { collectionId } = params;

  const [collection, collections] = await Promise.all([
    getCollectionImages(collectionId),
    getMyCollections(),
  ]);

  return (
    <main className="p-4 md:p-6">
      <div className="flex items-center justify-between pb-2">
        <Breadcrumbs
          collections={collections}
          currentCollectionName={collection.name}
        />
        <ImageUploadButton collectionId={collectionId} />
      </div>
      <MasonryGrid
        images={collection.images.map(({ name, url, id }) => ({
          name,
          url,
          id,
        }))}
      />
    </main>
  );
}

function Breadcrumbs(props: {
  collections: Awaited<ReturnType<typeof getMyCollections>>;
  currentCollectionName: string;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <Link href="/">Home</Link>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbItem>
          <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center gap-1">
              Collections
              <span className="sr-only">Toggle menu</span>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {props.collections.map((collection) => (
                <DropdownMenuItem
                  className="cursor-pointer"
                  key={collection.id}
                >
                  <Link
                    className="w-full"
                    href={`/collections/${collection.id}`}
                  >
                    {collection.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </BreadcrumbItem>
        <BreadcrumbSeparator />
        <BreadcrumbPage>{props.currentCollectionName}</BreadcrumbPage>
      </BreadcrumbList>
    </Breadcrumb>
  );
}
