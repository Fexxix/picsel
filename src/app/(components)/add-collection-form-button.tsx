"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusIcon } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { addCollection } from "../actions";
import { toast } from "sonner";

const collectionSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().max(200, "Description is too long").optional(),
});

type Collection = z.infer<typeof collectionSchema>;

export function AddCollectionFormButton() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const form = useForm<Collection>({
    resolver: zodResolver(collectionSchema),
    defaultValues: {
      name: "",
      description: "",
    },
  });

  const collectionMutation = useMutation({
    mutationKey: ["collections"],
    mutationFn: addCollection,
    onSuccess: () => {
      router.refresh();
      setIsOpen(false);
      toast.success("Collection created!");
    },
    onMutate: () => {
      toast.loading("Creating collection...", {
        id: "create-collection",
      });
    },
    onError: (error) => {
      toast.error(error.message);
    },
    onSettled: () => {
      toast.dismiss("create-collection");
    },
  });

  const onSubmit = async (data: Collection) => {
    await collectionMutation.mutateAsync(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="rounded-full">
          <PlusIcon className="h-5 w-5" />
          <span className="sr-only">Add Collection</span>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>Add a Collection</DialogHeader>
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
