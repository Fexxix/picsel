"use client";

import {
  TooltipProvider,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { TrashIcon, ImageIcon, Edit, PlusIcon } from "lucide-react";
import { ThumbnailUploadButton } from "./thumbnail-upload-button";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { deleteCollection, editCollection } from "../actions";
import { toast } from "sonner";
import { z } from "zod";
import { DialogHeader } from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm } from "react-hook-form";

type CollectionActionButtonsProps = {
  collectionId: string;
  imagesRef: string[];
  name: string;
  description: string;
};

export function CollectionActionButtons(props: CollectionActionButtonsProps) {
  const { collectionId, imagesRef } = props;

  return (
    <TooltipProvider>
      <DeleteButton collectionId={collectionId} imagesRef={imagesRef} />
      <EditButton
        collectionId={collectionId}
        description={props.description}
        name={props.name}
      />
      <ThumbnailButton collectionId={collectionId} />
    </TooltipProvider>
  );
}

function ThumbnailButton(
  props: Pick<CollectionActionButtonsProps, "collectionId">,
) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative overflow-hidden"
        >
          <ImageIcon className="h-5 w-5 text-white dark:text-gray-400" />
          <ThumbnailUploadButton collectionId={props.collectionId} />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Set Thumbnail</TooltipContent>
    </Tooltip>
  );
}

function DeleteButton(
  props: Pick<CollectionActionButtonsProps, "collectionId" | "imagesRef">,
) {
  return (
    <AlertDialog>
      <Tooltip>
        <TooltipTrigger asChild>
          <AlertDialogTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="group/delete hover:bg-red-500"
            >
              <TrashIcon className="h-5 w-5 text-white group-hover/delete:text-white dark:text-gray-400" />
              <span className="sr-only">Delete Collection</span>
            </Button>
          </AlertDialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Delete Collection</TooltipContent>
      </Tooltip>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Collection</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure? This action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={async () => {
              try {
                toast.loading("Deleting Collection...", {
                  id: "delete-collection",
                });

                await deleteCollection(props);

                toast.success("Collection Deleted");
              } catch {
                toast.error("Failed to delete collection");
              } finally {
                toast.dismiss("delete-collection");
              }
            }}
          >
            Continue
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

const editCollectionSchema = z
  .object({
    name: z.string().min(1, "Name is required").optional(),
    description: z.string().max(200, "Description is too long").optional(),
  })
  .refine(
    (data) => Object.keys(data).length > 0,
    "At least one field is required",
  );

type EditCollectionSchema = z.infer<typeof editCollectionSchema>;

function EditButton(
  props: Pick<
    CollectionActionButtonsProps,
    "collectionId" | "description" | "name"
  >,
) {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<EditCollectionSchema>({
    resolver: zodResolver(editCollectionSchema),
    defaultValues: {
      name: props.name,
      description: props.description,
    },
  });

  const collectionMutation = useMutation({
    mutationKey: ["collections"],
    mutationFn: async (data: EditCollectionSchema) =>
      editCollection(data, props.collectionId),
    onMutate: () => {
      toast.loading("Editing collection...", {
        id: "edit-collection",
      });
    },
    onSuccess: () => {
      router.refresh();
      setIsOpen(false);
      toast.success("Collection edited!");
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      toast.dismiss("edit-collection");
    },
  });

  const onSubmit = async (data: EditCollectionSchema) => {
    await collectionMutation.mutateAsync(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Tooltip>
        <TooltipTrigger asChild>
          <DialogTrigger asChild>
            <Button variant="ghost" size="icon">
              <Edit className="h-5 w-5 text-white dark:text-gray-400" />
              <span className="sr-only">Edit Collection</span>
            </Button>
          </DialogTrigger>
        </TooltipTrigger>
        <TooltipContent>Edit Collection</TooltipContent>
      </Tooltip>
      <DialogContent>
        <DialogHeader>Edit Collection</DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Collection Name</FormLabel>
                  <FormControl>
                    <Input placeholder="My Collection" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="My Collection" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <Button type="submit">Submit</Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
