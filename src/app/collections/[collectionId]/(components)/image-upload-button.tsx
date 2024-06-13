"use client";

import { UploadButton } from "@/lib/uploadthing";
import { Loader2, Upload } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function ImageUploadButton({ collectionId }: { collectionId: string }) {
  const router = useRouter();

  return (
    <UploadButton
      endpoint="imageUploader"
      className="ut-button:bg-black ut-button:text-white dark:ut-button:bg-zinc-950 dark:ut-button:text-white"
      content={{
        button: ({ ready, isUploading }) => {
          if (isUploading) {
            return <Loader2 className="relative z-10 size-4 animate-spin" />;
          }

          if (ready) {
            return (
              <div className="flex items-center gap-2">
                <Upload className="size-4" />
                <span className="sr-only sm:not-sr-only">Upload</span>
              </div>
            );
          }

          return <Loader2 className="size-4 animate-spin" />;
        },
      }}
      input={{ collectionId }}
      onUploadBegin={() => {
        toast.loading("Beginning Upload...", {
          id: "uploading-image",
        });
      }}
      onUploadProgress={(progress) => {
        toast.dismiss("uploading-image");
        toast.loading(`Uploading... (${progress}%)`, {
          id: "uploading-image-progress",
        });
      }}
      onClientUploadComplete={() => {
        toast.dismiss("uploading-image-progress");

        toast.success("Upload Complete!", {
          id: "uploading-image-complete",
        });
        router.refresh();
      }}
      onUploadError={(error) => {
        console.log(error.message);

        toast.dismiss("uploading-image-progress");

        toast.error("Upload failed!", {
          id: "uploading-image-error",
        });
      }}
    />
  );
}
