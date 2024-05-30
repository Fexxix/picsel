"use server"

import { redirect } from "next/navigation"
import UserModel from "@/models/UserModel"
import { auth, clerkClient } from "@clerk/nextjs/server"
import CollectionModel from "@/models/CollectionModel"
import { connectToDatabase } from "@/lib/mongodb"

export async function completeOnboarding() {
  const user = auth()

  if (!user.userId) {
    return { error: "Not signed in!" }
  }

  try {
    await connectToDatabase()

    const exists = await UserModel.exists({ _id: user.userId })

    if (exists) {
      return { error: "User already exists!" }
    }

    const [userDoc, defaultCollection] = await Promise.all([
      UserModel.create({ _id: user.userId, collections: [] }),
      CollectionModel.create({
        name: "Your Collection",
        images: [],
      }),
    ])

    userDoc.collections.push(defaultCollection._id)

    await userDoc.save()

    const res = await clerkClient.users.updateUser(user.userId, {
      publicMetadata: {
        onboardingComplete: true,
      },
    })

    return { message: res.publicMetadata }
  } catch (err) {
    console.error("[completeOnboarding]", err)

    return { error: "Something went wrong!" }
  }
}
