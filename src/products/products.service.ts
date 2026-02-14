import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ObjectId } from "mongodb";
import { MongoRepository } from "typeorm";
import { CategoriesService } from "../categories/categories.service";
import { CreateProductDto } from "./dto/create-product.dto";
import { QueryProductsDto } from "./dto/query-products.dto";
import { UpdateProductDto } from "./dto/update-product.dto";
import { Product } from "./entities/product.entity";

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: MongoRepository<Product>,
    private readonly categoriesService: CategoriesService
  ) { }

  private calculateDiscountPercentage(
    originalPrice: number,
    discountedPrice: number
  ): number {
    if (!originalPrice || originalPrice <= 0) {
      return 0;
    }

    const rawPercentage = (discountedPrice / originalPrice) * 100;
    const rounded = Math.round(rawPercentage * 100) / 100;
    return Math.min(100, Math.max(0, rounded));
  }

  async create(createProductDto: CreateProductDto) {
    const category = await this.categoriesService.findOne(createProductDto.category);
    if (!category) {
      throw new NotFoundException("Category not found.");
    }

    const discountedPrice = createProductDto.discountedPrice ?? 0;
    const discountPercentage = this.calculateDiscountPercentage(
      createProductDto.originalPrice,
      discountedPrice
    );

    // Set remainingStock to totalStock if not provided
    const remainingStock = createProductDto.remainingStock ?? createProductDto.totalStock;
    const soldQuantity = createProductDto.soldQuantity ?? 0;

    const product = this.productRepository.create({
      ...createProductDto,
      discountedPrice,
      discountPercentage,
      remainingStock,
      soldQuantity,
      isActive: createProductDto.isActive ?? true,
    });

    const saved = await this.productRepository.save(product);

    return {
      message: "Product created successfully.",
      product: saved,
    };
  }

  async findAll(query: QueryProductsDto = {}) {
    const match: Record<string, unknown> = {};

    if (query.category) {
      match.category = query.category;
    }

    if (query.search) {
      match.productName = { $regex: query.search, $options: "i" };
    }

    if (query.minPrice !== undefined || query.maxPrice !== undefined) {
      const priceFilter: Record<string, number> = {};

      if (query.minPrice !== undefined) {
        priceFilter.$gte = query.minPrice;
      }

      if (query.maxPrice !== undefined) {
        priceFilter.$lte = query.maxPrice;
      }

      match.discountedPrice = priceFilter;
    }

    if (query.isFeatured !== undefined) {
      match.isFeatured = query.isFeatured;
    }

    if (query.isOffer !== undefined) {
      match.isOffer = query.isOffer;
    }

    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 10));
    const skip = (page - 1) * limit;

    const matchStages: Array<Record<string, unknown>> =
      Object.keys(match).length > 0 ? [{ $match: match }] : [];

    const lookupStages: Array<Record<string, unknown>> = [
      {
        $addFields: {
          categoryObjectId: {
            $convert: {
              input: "$category",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
          imageObjectId: {
            $convert: {
              input: "$images",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryObjectId",
          foreignField: "_id",
          as: "categoryDoc",
        },
      },
      {
        $lookup: {
          from: "images",
          localField: "imageObjectId",
          foreignField: "_id",
          as: "imageDoc",
        },
      },
      {
        $addFields: {
          categoryName: {
            $ifNull: [{ $arrayElemAt: ["$categoryDoc.category_name", 0] }, null],
          },
          imageUrl: {
            $ifNull: [{ $arrayElemAt: ["$imageDoc.url", 0] }, null],
          },
        },
      },
      {
        $project: {
          categoryDoc: 0,
          imageDoc: 0,
          categoryObjectId: 0,
          imageObjectId: 0,
        },
      },
      { $sort: { createdAt: -1 } },
    ];

    const [result] = await this.productRepository
      .aggregate([
        {
          $facet: {
            items: [...matchStages, ...lookupStages, { $skip: skip }, { $limit: limit }],
            totalCount: [...matchStages, { $count: "total" }],
          },
        },
      ])
      .toArray();

    const total = result?.totalCount?.[0]?.total ?? 0;

    return {
      message: "Products retrieved successfully.",
      products: result?.items ?? [],
      total,
      page,
      limit,
    };
  }

  async findOne(id: string) {
    const pipeline: Array<Record<string, unknown>> = [
      {
        $match: {
          _id: new ObjectId(id),
        },
      },
      {
        $addFields: {
          categoryObjectId: {
            $convert: {
              input: "$category",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
          imageObjectId: {
            $convert: {
              input: "$images",
              to: "objectId",
              onError: null,
              onNull: null,
            },
          },
        },
      },
      {
        $lookup: {
          from: "categories",
          localField: "categoryObjectId",
          foreignField: "_id",
          as: "categoryDoc",
        },
      },
      {
        $lookup: {
          from: "images",
          localField: "imageObjectId",
          foreignField: "_id",
          as: "imageDoc",
        },
      },
      {
        $addFields: {
          categoryName: {
            $ifNull: [{ $arrayElemAt: ["$categoryDoc.category_name", 0] }, null],
          },
          imageUrl: {
            $ifNull: [{ $arrayElemAt: ["$imageDoc.url", 0] }, null],
          },
        },
      },
      {
        $project: {
          categoryDoc: 0,
          imageDoc: 0,
          categoryObjectId: 0,
          imageObjectId: 0,
        },
      },
    ];

    const result = await this.productRepository.aggregate(pipeline).toArray();
    const product = result?.[0];

    if (!product) {
      throw new NotFoundException("Product not found.");
    }

    return product;
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    if (updateProductDto.category) {
      await this.categoriesService.findOne(updateProductDto.category);
    }

    const product = await this.productRepository.findOneBy({
      _id: new ObjectId(id),
    });

    if (!product) {
      throw new NotFoundException("Product not found.");
    }

    Object.assign(product, updateProductDto);
    if (product.discountedPrice === undefined || product.discountedPrice === null) {
      product.discountedPrice = product.originalPrice;
    }

    if (
      updateProductDto.originalPrice !== undefined ||
      updateProductDto.discountedPrice !== undefined
    ) {
      product.discountPercentage = this.calculateDiscountPercentage(
        product.originalPrice,
        product.discountedPrice
      );
    }

    // If totalStock is updated and remainingStock is not provided, update remainingStock proportionally
    if (updateProductDto.totalStock !== undefined && updateProductDto.remainingStock === undefined) {
      const stockDifference = updateProductDto.totalStock - product.totalStock;
      product.remainingStock = Math.max(0, product.remainingStock + stockDifference);
    }

    return this.productRepository.save(product);
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    await this.productRepository.deleteOne({ _id: product._id });
    return { deleted: true };
  }


}
