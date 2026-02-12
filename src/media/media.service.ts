import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { MongoRepository } from "typeorm";
import { ImagekitService } from "../config/imagekit.config";
import { Media } from "./entities/media.entity";

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: MongoRepository<Media>,
    private readonly imagekitService: ImagekitService
  ) {}

  async uploadProductImage(file: Express.Multer.File) {
    const uploadResponse = await this.imagekitService.uploadImage(
      file,
      "products"
    );

    const media = this.mediaRepository.create({
      fileId: uploadResponse.fileId,
      url: uploadResponse.url,
      fileName: uploadResponse.name,
      size: uploadResponse.size,
      height: uploadResponse.height,
      width: uploadResponse.width,
    });

    const saved = await this.mediaRepository.save(media);

    return {
      message: "Image uploaded and saved successfully.",
      media: saved,
    };
  }

  async findAll() {
    return this.mediaRepository.find();
  }

  async findOne(id: string) {
    const media = await this.mediaRepository.findOneBy({
      _id: new ObjectId(id),
    });

    if (!media) {
      throw new NotFoundException("Media not found.");
    }

    return media;
  }

  async remove(id: string) {
    const media = await this.findOne(id);
    await this.mediaRepository.deleteOne({ _id: media._id });
    return { deleted: true };
  }
}
