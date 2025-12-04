"use client";

import { Category, Character } from "@prisma/client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import ImageUploader from "./image-uploader";
import { ElementRef, useEffect, useRef, useState } from "react";
import { useUploadThing } from "@/lib/uploadthing";
import { Textarea } from "@/components/ui/textarea";
import { Description } from "@/components/description";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PREAMBLE, SEED_CHAT } from "@/lib/constants";
import { useRouter } from "next/navigation";
import { createCharacter, updateCharacter } from "@/actions/character-actions";
import { useUser } from "@clerk/nextjs";
import toast from "react-hot-toast";

type CharacterFormProps = {
  initialData?: Character | null;
  categories: Category[];
};

const formSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  instructions: z
    .string()
    .min(200, { message: "Instruction must be at least 200 characters" }),
  seed: z
    .string()
    .min(200, { message: "seed must be at least 200 characters" }),
  backgroundstory: z
    .string()
    .min(200, { message: "backgroundStory must be at least 200 characters" }),
  imageUrl: z.string().min(1, { message: "Image is required" }),
  categoryId: z.string().min(1, { message: "Category is required" }),
});

const CharacterForm = ({ initialData, categories }: CharacterFormProps) => {
  const [image, setImage] = useState<File[]>([]);
  const router = useRouter();
  const { user } = useUser();
  const scrollRef = useRef<ElementRef<"div">>(null);
  const { startUpload, isUploading } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      name: "",
      description: "",
      instructions: "",
      seed: "",
      backgroundstory: "",
      imageUrl: "",
      categoryId: undefined,
    },
  });
  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [isUploading]);
  const isLoading = form.formState.isSubmitting;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    let uploadedImageUrl = values.imageUrl;
    if (image.length > 0) {
      const uploadedImage = await startUpload(image);
      if (!uploadedImage) {
        return;
      }
      uploadedImageUrl = uploadedImage[0].url;
      toast.success("Image uploaded successfully");
    }
    const response = initialData
      ? await updateCharacter({
          ...values,
          imageUrl: uploadedImageUrl,
          userId: user?.id,
          userName: user?.username,
          characterId: initialData.id,
        })
      : await createCharacter({
          ...values,
          imageUrl: uploadedImageUrl,
          userId: user?.id,
          userName: user?.username,
        });
    if (response?.status === "ok") {
      toast.success("success");
      router.refresh();
      router.push("/");
    } else {
      toast.error(`${response?.message}`);
    }
  };
  return (
    <div className="max-w-3xl mx-auto h-full p-4 space-y-2">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <>
                  <div ref={scrollRef} />
                  <FormControl>
                    <ImageUploader
                      onFieldChange={field.onChange}
                      imageUrl={field.value}
                      setImage={setImage}
                      disabled={isLoading}
                      isUploading={isUploading}
                    />
                  </FormControl>
                </>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Name</FormLabel>
                  <Description title="Name of your character" />
                </div>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="levi Ackerman"
                    className="placeholder:text-xs"
                    disabled={isLoading}
                  />
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
                <div className="flex items-center gap-2">
                  <FormLabel>Description</FormLabel>
                  <Description title="Description for your character" />
                </div>
                <FormControl>
                  <Textarea
                    onChange={field.onChange}
                    value={field.value}
                    placeholder="Squad captain of the Special Operations Squad within the Survey Corps, and is said to be humanity's strongest soldier. "
                    className="resize-none placeholder:text-xs placeholder:md:text-sm"
                    disabled={isLoading}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Category</FormLabel>
                  <Description title="Select your category" />
                </div>

                <Select
                  defaultValue={field.value}
                  onValueChange={field.onChange}
                  value={field.value}
                  disabled={isLoading}
                >
                  <FormControl>
                    <SelectTrigger className="">
                      <SelectValue
                        defaultValue={field.value}
                        placeholder="Select a category"
                      />
                    </SelectTrigger>
                  </FormControl>

                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="instructions"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Instructions</FormLabel>
                  <Description title="Describe in detail your character's backstory and relevant details" />
                </div>

                <FormControl>
                  <Textarea
                    onChange={field.onChange}
                    value={field.value}
                    placeholder={PREAMBLE}
                    className="resize-none placeholder:text-xs placeholder:md:text-sm"
                    disabled={isLoading}
                    rows={7}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="seed"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>Example conversation</FormLabel>
                  <Description title="Example conversation with a character" />
                </div>

                <FormControl>
                  <Textarea
                    onChange={field.onChange}
                    value={field.value}
                    placeholder={SEED_CHAT}
                    className="resize-none placeholder:text-xs placeholder:md:text-sm"
                    disabled={isLoading}
                    rows={7}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="backgroundstory"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center gap-2">
                  <FormLabel>characters background</FormLabel>
                  <Description title="Describe in detail your character's backstory and relevant details" />
                </div>

                <FormControl>
                  <Textarea
                    onChange={field.onChange}
                    value={field.value}
                    className="resize-none placeholder:text-xs placeholder:md:text-sm"
                    disabled={isLoading}
                    rows={7}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex justify-end">
            <Button
              type="submit"
              disabled={!form.formState.isDirty || isLoading}
            >
              {initialData ? "Edit" : "Create"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default CharacterForm;
