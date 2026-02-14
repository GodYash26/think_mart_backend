import { memoryStorage, type Options } from "multer";
import path from "path";
import { BadRequestException } from "@nestjs/common";
import type { Request } from "express";



const allowedMimeTypes = new Set(["image/jpeg", "image/png", "image/webp"]);
const allowedExtensions = new Set([".jpeg", ".jpg", ".png", ".webp"]);

type FileFilterCallback = (error: Error | null, acceptFile: boolean) => void;


const imageFileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: FileFilterCallback
) => {
  const ext = path.extname(file.originalname).toLowerCase();
  const mimeType = file.mimetype.toLowerCase();

  if (allowedMimeTypes.has(mimeType) && allowedExtensions.has(ext)) {
    cb(null, true);
    return;
  }

  cb(
    new BadRequestException(
      "Only image files (jpeg, jpg, png, webp) are allowed."
    ) as unknown as Error,
    false
  );
};

// multer configuration for image uploads
export const imageUploadOptions: Options = {
  storage: memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
};


