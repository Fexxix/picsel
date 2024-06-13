import { connectToDatabase } from "@/lib/mongodb";
import CollectionModel from "@/models/CollectionModel";
import ImageModel from "@/models/ImageModel";
import { auth } from "@clerk/nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { z } from "zod";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  collectionThumbnailUploader: f({ image: { maxFileSize: "4MB" } })
    .input(
      z.object({
        collectionId: z.string(),
      }),
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const user = auth();

      // If you throw, the user will not be able to upload
      if (!user.userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId, collectionId: input.collectionId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      try {
        await connectToDatabase();

        await CollectionModel.updateOne(
          { _id: metadata.collectionId },
          { thumbnail: file.url },
        );
      } catch (err) {
        console.error("Failed to upload collection thumbnail", err);
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),

  imageUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 5 } })
    .input(
      z.object({
        collectionId: z.string(),
      }),
    )
    // Set permissions and file types for this FileRoute
    .middleware(async ({ input }) => {
      // This code runs on your server before upload
      const user = auth();

      // If you throw, the user will not be able to upload
      if (!user.userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId: user.userId, collectionId: input.collectionId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);

      console.log("file url", file.url);

      try {
        await connectToDatabase();

        const imageDoc = await ImageModel.create({
          user: metadata.userId,
          collection: metadata.collectionId,
          url: file.url,
          name: file.name,
          owner: metadata.userId,
        });

        await CollectionModel.updateOne(
          { _id: metadata.collectionId },
          {
            $push: {
              images: imageDoc._id,
            },
          },
        );
      } catch (err) {
        console.error("Failed to upload image", err);
      }

      // !!! Whatever is returned here is sent to the clientside `onClientUploadComplete` callback
      return { uploadedBy: metadata.userId };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
