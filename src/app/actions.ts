"use server";

import { connectToDatabase } from "@/lib/mongodb";
import CollectionModel from "@/models/CollectionModel";
import UserModel from "@/models/UserModel";
import ImageModel from "@/models/ImageModel";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const collectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().max(200, "Description is too long").optional(),
});

const editCollectionSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().max(200, "Description is too long").optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required",
  );

export async function addCollection(data: z.infer<typeof collectionSchema>) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  try {
    const parsedData = collectionSchema.parse(data);

    await connectToDatabase();

    const newCollectionDoc = await CollectionModel.create({
      ...parsedData,
      owner: userId,
    });

    await UserModel.updateOne(
      { _id: userId },
      {
        $addToSet: {
          collections: newCollectionDoc.id,
        },
      },
    );
  } catch (err) {
    console.log("[addCollection]", err);

    if (err instanceof z.ZodError) {
      throw new Error("Invalid input");
    } else {
      throw new Error("Unknown error");
    }
  }
}

export async function deleteCollection({
  collectionId,
  imagesRef,
}: {
  collectionId: string;
  imagesRef: string[];
}) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  console.log({ imagesRef });

  try {
    await connectToDatabase();

    await Promise.all([
      ImageModel.deleteMany({ _id: { $in: imagesRef } }),
      CollectionModel.deleteOne({ _id: collectionId, owner: userId }),
    ]);
  } catch (err) {
    console.error("Failed to delete collection", err);

    throw new Error("Failed to delete collection");
  }

  revalidatePath("/");
}

export async function editCollection(
  data: z.infer<typeof editCollectionSchema>,
  id: string,
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const result = editCollectionSchema.safeParse(data);
  if (!result.success) {
    throw new Error("Invalid input");
  }

  try {
    await connectToDatabase();

    await CollectionModel.updateOne({ _id: id }, { ...data });

    revalidatePath("/");
  } catch (err) {
    console.error("Failed to edit collection", err);
  }
}
