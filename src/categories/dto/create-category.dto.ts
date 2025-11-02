import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsBoolean } from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({
    description: 'Category name',
    example: 'Web Development',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    description: 'Category description',
    example: 'Learn web development technologies',
    required: false,
  })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({
    description: 'Icon URL or name',
    example: 'web-icon',
    required: false,
  })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiProperty({
    description: 'Is category active',
    example: true,
    required: false,
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;
}
