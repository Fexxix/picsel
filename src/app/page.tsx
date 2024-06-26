import { getMyCollections } from "@/server/queries";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AddCollectionFormButton } from "./(components)/add-collection-form-button";
import { SignedIn, SignedOut } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import { CollectionCard } from "./(components)/collection-card";

export default async function Home() {
  const { userId } = auth();

  if (!userId) {
    return <SignedOut>Please sign in above</SignedOut>;
  }

  const collections = await getMyCollections();

  return (
    <SignedIn>
      <main className="p-4 md:p-6">
        <div className="flex items-center justify-between">
          <Breadcrumbs collections={collections} />
          <AddCollectionFormButton />
        </div>
        <section className="grid grid-cols-1 gap-6 p-4 md:grid-cols-2 md:p-6 lg:grid-cols-3 xl:grid-cols-4">
          {collections.map((collection) => (
            <CollectionCard key={collection.id} collection={collection} />
          ))}
        </section>
      </main>
    </SignedIn>
  );
}

function Breadcrumbs(props: {
  collections: Awaited<ReturnType<typeof getMyCollections>>;
}) {
  return (
    <Breadcrumb>
      <BreadcrumbList>
        <BreadcrumbItem>
          <BreadcrumbPage>Home</BreadcrumbPage>
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
      </BreadcrumbList>
    </Breadcrumb>
  );
}
