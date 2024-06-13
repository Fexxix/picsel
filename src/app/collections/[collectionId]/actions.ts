"use server";

import { connectToDatabase } from "@/lib/mongodb";
import ImageModel from "@/models/ImageModel";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteImage({
  imageId,
  collectionId,
}: {
  collectionId: string;
  imageId: string;
}) {
  const user = auth();

  if (!user.userId) {
    throw new Error("Unauthorized");
  }

  try {
    await connectToDatabase();

    await ImageModel.deleteOne({
      _id: imageId,
      owner: user.userId,
    });

    revalidatePath(`/collections/${collectionId}`);
  } catch (err) {
    console.error("Failed to delete image", err);

    throw new Error("Failed to delete image");
  }
}
