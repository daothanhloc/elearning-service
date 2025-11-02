import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsArray,
  IsBoolean,
  IsUUID,
  Min,
} from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({
    description: 'Course title',
    example: 'Complete Web Development Bootcamp',
  })
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty({
    description: 'Course description',
    example: 'Learn HTML, CSS, JavaScript, React, Node.js and more',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Course price',
    example: 99.99,
  })
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({
    description: 'Instructor ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsString()
  @IsNotEmpty()
  instructorId: string;

  @ApiProperty({
    description: 'Instructor name',
    example: 'John Doe',
  })
  @IsString()
  @IsNotEmpty()
  instructorName: string;

  @ApiProperty({
    description: 'Category ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  categoryId: string;

  @ApiProperty({
    description: 'Thumbnail image URL',
    example: 'https://example.com/thumbnail.jpg',
    required: false,
  })
  @IsString()
  @IsOptional()
  thumbnailUrl?: string;

  @ApiProperty({
    description: 'Preview video URL',
    example: 'https://example.com/preview.mp4',
    required: false,
  })
  @IsString()
  @IsOptional()
  previewVideoUrl?: string;

  @ApiProperty({
    description: 'Course tags',
    example: ['javascript', 'react', 'nodejs'],
    required: false,
  })
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @ApiProperty({
    description: 'Course status',
    example: 'draft',
    enum: ['draft', 'published', 'archived'],
    required: false,
  })
  @IsString()
  @IsOptional()
  status?: string;

  @ApiProperty({
    description: 'Total lessons',
    example: 50,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalLessons?: number;

  @ApiProperty({
    description: 'Total duration in minutes',
    example: 1200,
    required: false,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  totalDuration?: number;
}
