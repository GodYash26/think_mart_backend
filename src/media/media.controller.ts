import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors,
} from "@nestjs/common";
import { FileInterceptor } from "@nestjs/platform-express";
import { imageUploadOptions } from "../config/multer.config";
import { MediaService } from "./media.service";
import { CreateMediaDto } from "./dto/create-media.dto";
import { UpdateMediaDto } from "./dto/update-media.dto";

@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post("products")
  @UseInterceptors(FileInterceptor("image", imageUploadOptions))
  uploadProductImage(@UploadedFile() file?: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException("Image file is required.");
    }

    return this.mediaService.uploadProductImage(file);
  }

  @Post()
  create(@Body() createMediaDto: CreateMediaDto) {
    return this.mediaService.create(createMediaDto);
  }

  @Get()
  findAll() {
    return this.mediaService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.mediaService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateMediaDto: UpdateMediaDto) {
    return this.mediaService.update(+id, updateMediaDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.mediaService.remove(+id);
  }
}
