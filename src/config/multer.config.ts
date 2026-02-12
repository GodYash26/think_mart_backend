import multer, { memoryStorage } from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { MulterError as multerMulterError } from "multer";
import { BadRequestException } from "@nestjs/common";
import type { Request } from "express";

// setup for image folder
export const ensureUploadDirs = () => {
  const dirs = ["uploads/images"];
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// initialize directories
ensureUploadDirs();

const generateUniqueFilename = (originalName: string) => {
  const ext = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, ext);

  const truncatedName =
    nameWithoutExt.length > 50 ? nameWithoutExt.slice(0, 50) : nameWithoutExt;

  const uniqueSuffix = crypto.randomBytes(8).toString("hex");
  const timestamp = Date.now();

  return `${truncatedName}_${uniqueSuffix}_${timestamp}${ext}`;
};

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

//  storage for images
const imageStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/images/");
  },
  filename: (req, file, cb) => {
    const uniqueName = generateUniqueFilename(file.originalname);
    cb(null, uniqueName);
  },
});

// multer configuration for image uploads
export const imageUploadOptions: multer.Options = {
  storage: memoryStorage(),
  fileFilter: imageFileFilter,
  limits: { fileSize: 2 * 1024 * 1024 }, // 2 MB limit
};

export const handleMulterError = (error: unknown) => {
  if (!error) {
    return;
  }

  if (error instanceof BadRequestException) {
    throw error;
  }

  if (error instanceof multerMulterError) {
    if (error.code === "LIMIT_FILE_SIZE") {
      throw new BadRequestException("Image too large. Max size is 2 MB.");
    }

    if (error.code === "LIMIT_UNEXPECTED_FILE") {
      throw new BadRequestException("Unexpected file field in upload.");
    }

    throw new BadRequestException(`Upload error: ${error.message}`);
  }

  throw new BadRequestException("Unable to process uploaded image.");
};



// function to delete uploaded files
// const deleteFiles = (filepath: string) => {
//   try {
//     if (fs.existsSync(filepath)) {
//       fs.unlinkSync(filepath);
//       return true;
//     }
//     return false;
//   } catch (error) {
//     console.error("Error deleting file:", error);
//     return false;
//   }
// };

