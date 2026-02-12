import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { MongoRepository } from "typeorm";
import { CategoriesService } from "../categories/categories.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: MongoRepository<Product>,
    private readonly categoriesService: CategoriesService
  ) {}

  private calculateDiscountedPrice(
    originalPrice: number,
    discountPercentage: number
  ): number {
    return Math.round((originalPrice * (100 - discountPercentage)) / 100 * 100) / 100;
  }

  async create(createProductDto: CreateProductDto) {
    await this.categoriesService.findOne(createProductDto.category);

    const discountedPrice =
      createProductDto.discountedPrice ||
      this.calculateDiscountedPrice(
        createProductDto.originalPrice,
        createProductDto.discountPercentage
      );

    const product = this.productRepository.create({
      ...createProductDto,
      discountedPrice,
      isActive: createProductDto.isActive ?? true,
    });

    const saved = await this.productRepository.save(product);

    return {
      message: "Product created successfully.",
      product: saved,
    };
  }

  async findAll() {
    return this.productRepository.find();
  }

  async findOne(id: string) {
    const product = await this.productRepository.findOneBy({
      _id: new ObjectId(id),
    });

    if (!product) {
      throw new NotFoundException("Product not found.");
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (updateProductDto.category) {
      await this.categoriesService.findOne(updateProductDto.category);
    }

    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.deleteOne({ _id: product._id });
    return { deleted: true };
  }

  async checkAvailability(id: string) {
    const product = await this.findOne(id);
    return { available: product.isActive };
  }
}
