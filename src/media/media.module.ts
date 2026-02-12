import { Module } from "@nestjs/common";
import { ImagekitService } from "../config/imagekit.config";
import { MediaService } from "./media.service";
import { MediaController } from "./media.controller";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Media } from "./entities/media.entity";

@Module({
  imports: [TypeOrmModule.forFeature([Media])],
  controllers: [MediaController],
  providers: [MediaService, ImagekitService],
})
export class MediaModule {}
