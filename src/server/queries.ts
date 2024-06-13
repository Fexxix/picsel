import "server-only";

import UserModel from "@/models/UserModel";
import CollectionModel, { type Collection } from "@/models/CollectionModel";
import ImageModel, { type Image } from "@/models/ImageModel";
import { connectToDatabase } from "@/lib/mongodb";
import { auth } from "@clerk/nextjs/server";
import { cache } from "react";

ImageModel;

export const getMyCollections = cache(async () => {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const user = await UserModel.findOne({ _id: userId })
    .populate<{ collections: Collection[] }>("collections")
    .limit(20);

  if (!user) {
    throw new Error("User not found");
  }

  return user.collections;
});

export async function getCollectionImages(id: string) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const collection = await CollectionModel.findById(id)
    .populate<{ images: Image[] }>("images")
    .limit(100);

  if (!collection) {
    throw new Error("Collection not found");
  }

  return collection;
}

export async function getCollectionImage(
  collectionId: string,
  imageId: string,
) {
  const { userId } = auth();

  if (!userId) {
    throw new Error("Unauthorized");
  }

  await connectToDatabase();

  const image = await ImageModel.findOne({
    _id: imageId,
    owner: userId,
    collection: collectionId,
  });

  if (!image) {
    throw new Error("Image not found");
  }

  return {
    name: image.name,
    url: image.url,
  };
}
