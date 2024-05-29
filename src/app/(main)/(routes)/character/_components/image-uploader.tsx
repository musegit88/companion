"use client";

import { Dispatch, SetStateAction, useCallback } from "react";
import { useDropzone } from "@uploadthing/react/hooks";
import { generateClientDropzoneAccept } from "uploadthing/client";
// @ts-ignore
import type { FileWithPath } from "@uploadthing/react";

import { cn, convertFileToUrl } from "@/lib/utils";
import { Pen, Upload } from "lucide-react";
import Image from "next/image";
import { PuffLoader } from "react-spinners";

type ImageUploaderProps = {
  onFieldChange: (url: string) => void;
  imageUrl: string;
  setImage: Dispatch<SetStateAction<File[]>>;
  disabled: boolean;
  isUploading: boolean;
};

const ImageUploader = ({
  imageUrl,
  onFieldChange,
  setImage,
  disabled,
  isUploading,
}: ImageUploaderProps) => {
  const onDrop = useCallback((acceptedFile: FileWithPath[]) => {
    setImage(acceptedFile);
    onFieldChange(convertFileToUrl(acceptedFile[0]));

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: "image/*" ? generateClientDropzoneAccept(["image/*"]) : undefined,
  });

  return (
    <div className="relative w-24 h-24 cursor-pointer" {...getRootProps()}>
      <input {...getInputProps()} disabled={disabled || isUploading} />
      {imageUrl ? (
        <div className="relative w-full h-full rounded-full overflow-hidden border-2 border-blue-700">
          {isUploading && (
            <PuffLoader
              color="blue"
              size={100}
              className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%] z-50"
            />
          )}
          <Image
            src={imageUrl}
            alt="Image"
            fill
            className={cn(
              "w-full object-cover object-center",
              isUploading && "opacity-40"
            )}
          />
          {!isUploading && (
            <Pen
              className="absolute top-1/2 left-1/2 -translate-x-[50%] -translate-y-[50%]"
              size={20}
            />
          )}
        </div>
      ) : (
        <div className="flex items-center justify-center border bg-gradient-to-r from-indigo-400 to-cyan-400 w-24 h-24 transition-all rounded-full">
          <Upload />
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
