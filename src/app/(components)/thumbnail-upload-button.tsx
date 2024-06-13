"use client"

import { UploadButton } from "@/lib/uploadthing"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

export const ThumbnailUploadButton = (props: { collectionId: string }) => {
  const router = useRouter()

  return (
    <UploadButton
      endpoint="collectionThumbnailUploader"
      className="absolute inset-0 opacity-0 h-full w-full ut-label:h-full ut-label:w-full ut-button:h-full ut-button:w-full ut-allowed-content:sr-only z-50"
      input={{ collectionId: props.collectionId }}
      onUploadBegin={() => {
        toast.loading("Beginning Upload...", {
          id: "uploading-thumbnail",
        })
      }}
      onUploadProgress={(progress) => {
        toast.dismiss("uploading-thumbnail")
        toast.loading(`Uploading... (${progress}%)`, {
          id: "uploading-thumbnail-progress",
        })
      }}
      onClientUploadComplete={() => {
        toast.dismiss("uploading-thumbnail")
        toast.dismiss("uploading-thumbnail-progress")

        toast.success("Thumbnail uploaded")
        router.refresh()
      }}
      onUploadError={() => {
        toast.dismiss("uploading-thumbnail")
        toast.dismiss("uploading-thumbnail-progress")

        toast.error("Failed to upload thumbnail")
      }}
    />
  )
}
