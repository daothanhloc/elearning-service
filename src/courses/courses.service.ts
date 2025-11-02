import {
  Injectable,
  NotFoundException,
  Logger,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, FindOptionsWhere, ILike } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { CategoriesService } from '../categories/categories.service';

@Injectable()
export class CoursesService {
  private readonly logger = new Logger(CoursesService.name);

  constructor(
    @InjectRepository(Course)
    private courseRepository: Repository<Course>,
    private categoriesService: CategoriesService,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    try {
      // Verify category exists
      await this.categoriesService.findOne(createCourseDto.categoryId);

      const course = this.courseRepository.create({
        ...createCourseDto,
        status: createCourseDto.status || 'draft',
        isPublished: createCourseDto.status === 'published',
      });

      const savedCourse = await this.courseRepository.save(course);
      this.logger.log(`Course created: ${savedCourse.id}`);

      return savedCourse;
    } catch (error) {
      this.logger.error(`Error creating course: ${error.message}`, error.stack);
      throw error;
    }
  }

  async findAll(
    page: number = 1,
    limit: number = 10,
    categoryId?: string,
    status?: string,
    search?: string,
    sortBy?: string,
    sortOrder: 'ASC' | 'DESC' = 'DESC',
  ): Promise<{ data: Course[]; total: number; page: number; limit: number }> {
    try {
      const skip = (page - 1) * limit;
      const whereConditions: FindOptionsWhere<Course> = {};

      if (categoryId) {
        whereConditions.categoryId = categoryId;
      }

      if (status) {
        whereConditions.status = status;
      }

      if (search) {
        whereConditions.title = ILike(`%${search}%`);
      }

      const [data, total] = await this.courseRepository.findAndCount({
        where: whereConditions,
        relations: ['category'],
        skip,
        take: limit,
        order: {
          createdAt: sortOrder,
          ...(sortBy ? { [sortBy]: sortOrder } : {}),
        },
      });

      return {
        data,
        total,
        page,
        limit,
      };
    } catch (error) {
      this.logger.error(
        `Error fetching courses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findOne(id: string): Promise<Course> {
    try {
      const course = await this.courseRepository.findOne({
        where: { id },
        relations: ['category'],
      });

      if (!course) {
        throw new NotFoundException(`Course with ID ${id} not found`);
      }

      return course;
    } catch (error) {
      this.logger.error(
        `Error fetching course ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    try {
      const course = await this.findOne(id);

      // If categoryId is being updated, verify it exists
      if (updateCourseDto.categoryId) {
        await this.categoriesService.findOne(updateCourseDto.categoryId);
      }

      // Update published status based on status
      if (updateCourseDto.status) {
        updateCourseDto['isPublished'] = updateCourseDto.status === 'published';
      }

      Object.assign(course, updateCourseDto);
      const updatedCourse = await this.courseRepository.save(course);

      this.logger.log(`Course updated: ${updatedCourse.id}`);
      return updatedCourse;
    } catch (error) {
      this.logger.error(
        `Error updating course ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async remove(id: string): Promise<void> {
    try {
      const course = await this.findOne(id);
      await this.courseRepository.remove(course);

      this.logger.log(`Course deleted: ${id}`);
    } catch (error) {
      this.logger.error(
        `Error deleting course ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async updateRating(id: string, rating: number): Promise<Course> {
    try {
      if (rating < 0 || rating > 5) {
        throw new BadRequestException('Rating must be between 0 and 5');
      }

      const course = await this.findOne(id);
      const newTotalRatings = course.totalRatings + 1;
      const newRating =
        (course.rating * course.totalRatings + rating) / newTotalRatings;

      course.rating = Number(newRating.toFixed(2));
      course.totalRatings = newTotalRatings;

      const updatedCourse = await this.courseRepository.save(course);
      this.logger.log(`Course rating updated: ${updatedCourse.id}`);

      return updatedCourse;
    } catch (error) {
      this.logger.error(
        `Error updating course rating ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async incrementEnrollment(id: string): Promise<Course> {
    try {
      const course = await this.findOne(id);
      course.studentsEnrolled += 1;

      const updatedCourse = await this.courseRepository.save(course);
      this.logger.log(`Course enrollment incremented: ${updatedCourse.id}`);

      return updatedCourse;
    } catch (error) {
      this.logger.error(
        `Error incrementing enrollment ${id}: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }

  async findByInstructor(instructorId: string): Promise<Course[]> {
    try {
      return await this.courseRepository.find({
        where: { instructorId },
        relations: ['category'],
        order: { createdAt: 'DESC' },
      });
    } catch (error) {
      this.logger.error(
        `Error fetching instructor courses: ${error.message}`,
        error.stack,
      );
      throw error;
    }
  }
}
