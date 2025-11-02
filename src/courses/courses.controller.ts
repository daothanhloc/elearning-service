import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  ParseIntPipe,
  DefaultValuePipe,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './course.entity';

@ApiTags('courses')
@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new course' })
  @ApiResponse({
    status: 201,
    description: 'Course created successfully',
    type: Course,
  })
  @ApiResponse({ status: 404, description: 'Category not found' })
  create(@Body() createCourseDto: CreateCourseDto): Promise<Course> {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses with pagination and filters' })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number',
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Items per page',
  })
  @ApiQuery({
    name: 'categoryId',
    required: false,
    type: String,
    description: 'Filter by category',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    type: String,
    description: 'Filter by status',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    type: String,
    description: 'Search by title',
  })
  @ApiQuery({
    name: 'sortBy',
    required: false,
    type: String,
    description: 'Sort field',
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    enum: ['ASC', 'DESC'],
    description: 'Sort order',
  })
  @ApiResponse({
    status: 200,
    description: 'Paginated list of courses',
  })
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('categoryId') categoryId?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
    @Query('sortBy') sortBy?: string,
    @Query('sortOrder') sortOrder?: 'ASC' | 'DESC',
  ) {
    return this.coursesService.findAll(
      page,
      limit,
      categoryId,
      status,
      search,
      sortBy,
      sortOrder,
    );
  }

  @Get('instructor/:instructorId')
  @ApiOperation({ summary: 'Get courses by instructor' })
  @ApiParam({ name: 'instructorId', description: 'Instructor ID' })
  @ApiResponse({
    status: 200,
    description: 'List of courses by instructor',
    type: [Course],
  })
  findByInstructor(
    @Param('instructorId') instructorId: string,
  ): Promise<Course[]> {
    return this.coursesService.findByInstructor(instructorId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a course by ID' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  @ApiResponse({
    status: 200,
    description: 'Course details',
    type: Course,
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  findOne(@Param('id', ParseUUIDPipe) id: string): Promise<Course> {
    return this.coursesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a course' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  @ApiResponse({
    status: 200,
    description: 'Course updated successfully',
    type: Course,
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ): Promise<Course> {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a course' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  @ApiResponse({ status: 200, description: 'Course deleted successfully' })
  @ApiResponse({ status: 404, description: 'Course not found' })
  remove(@Param('id', ParseUUIDPipe) id: string): Promise<void> {
    return this.coursesService.remove(id);
  }

  @Patch(':id/rating')
  @ApiOperation({ summary: 'Update course rating' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  @ApiQuery({ name: 'rating', type: Number, description: 'Rating value (0-5)' })
  @ApiResponse({
    status: 200,
    description: 'Rating updated successfully',
    type: Course,
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  @ApiResponse({ status: 400, description: 'Invalid rating value' })
  updateRating(
    @Param('id', ParseUUIDPipe) id: string,
    @Query('rating', ParseIntPipe) rating: number,
  ): Promise<Course> {
    return this.coursesService.updateRating(id, rating);
  }

  @Patch(':id/enroll')
  @ApiOperation({ summary: 'Increment student enrollment' })
  @ApiParam({ name: 'id', description: 'Course UUID' })
  @ApiResponse({
    status: 200,
    description: 'Enrollment incremented successfully',
    type: Course,
  })
  @ApiResponse({ status: 404, description: 'Course not found' })
  incrementEnrollment(@Param('id', ParseUUIDPipe) id: string): Promise<Course> {
    return this.coursesService.incrementEnrollment(id);
  }
}
