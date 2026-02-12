import { Injectable } from "@nestjs/common";
import type { Express } from "express";
import ImageKit from "imagekit";
import type { UploadResponse } from "imagekit/dist/libs/interfaces";

@Injectable()
export class ImagekitService {
  private imagekit: ImageKit;

  constructor() {
    this.imagekit = new ImageKit({
      publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
      privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
      urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
    });
  }

  async uploadImage(
    file: Express.Multer.File,
    folder = "products"
  ): Promise<UploadResponse> {
    return this.imagekit.upload({
      file: file.buffer.toString("base64"),
      fileName: file.originalname,
      folder,
    });
  }
}
