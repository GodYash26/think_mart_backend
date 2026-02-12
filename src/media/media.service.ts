import { Injectable } from "@nestjs/common";
import { ImagekitService } from "../config/imagekit.config";
import { CreateMediaDto } from "./dto/create-media.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";

@Injectable()
export class MediaService {
  constructor(private readonly imagekitService: ImagekitService) {}

  async uploadProductImage(file: Express.Multer.File) {
    return this.imagekitService.uploadImage(file, "products");
  }

  create(createMediaDto: CreateMediaDto) {
    return 'This action adds a new media';
  }

  findAll() {
    return `This action returns all media`;
  }

  findOne(id: number) {
    return `This action returns a #${id} media`;
  }

  update(id: number, updateMediaDto: UpdateMediaDto) {
    return `This action updates a #${id} media`;
  }

  remove(id: number) {
    return `This action removes a #${id} media`;
  }
}
