import {
  Injectable,
  NotFoundException,
  ConflictException,
  Logger,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from './category.entity';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  private readonly logger = new Logger(CategoriesService.name);

  constructor(
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
  ) {}

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    try {
      const existingCategory = await this.categoryRepository.findOne({
        where: { name: createCategoryDto.name },
      });

      if (existingCategory) {
        throw new ConflictException('Category with this name already exists');
      }

      const category = this.categoryRepository.create(createCategoryDto);
      const savedCategory = await this.categoryRepository.save(category);

      this.logger.log(`Category created: ${savedCategory.id}`);
      return savedCategory;
    } catch (error) {
      this.logger.error(
        `Error creating category: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAll(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching categories: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findAllWithInactive(): Promise<Category[]> {
    try {
      return await this.categoryRepository.find({
        order: { name: 'ASC' },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching all categories: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Category> {
    try {
      const category = await this.categoryRepository.findOne({
        where: { id },
        relations: ['courses'],
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      this.logger.error(
        `Error fetching category ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    try {
      const category = await this.findOne(id);

      // Check if name is being updated and conflicts with existing name
      if (updateCategoryDto.name && updateCategoryDto.name !== category.name) {
        const existingCategory = await this.categoryRepository.findOne({
          where: { name: updateCategoryDto.name },
        });

        if (existingCategory) {
          throw new ConflictException('Category with this name already exists');
        }
      }

      Object.assign(category, updateCategoryDto);
      const updatedCategory = await this.categoryRepository.save(category);

      this.logger.log(`Category updated: ${updatedCategory.id}`);
      return updatedCategory;
    } catch (error) {
      this.logger.error(
        `Error updating category ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const category = await this.findOne(id);
      await this.categoryRepository.remove(category);

      this.logger.log(`Category deleted: ${id}`);
    } catch (error) {
      this.logger.error(
        `Error deleting category ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async softDelete(id: string): Promise<Category> {
    try {
      const category = await this.findOne(id);
      category.isActive = false;
      return await this.categoryRepository.save(category);
    } catch (error) {
      this.logger.error(
        `Error soft deleting category ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
