import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CoursesService } from './courses.service';
import { Course } from './course.entity';
import { CategoriesService } from '../categories/categories.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';

describe('CoursesService', () => {
  let service: CoursesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findAndCount: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockCategoriesService = {
    findOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useValue: mockRepository,
        },
        {
          provide: CategoriesService,
          useValue: mockCategoriesService,
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    module.get<Repository<Course>>(getRepositoryToken(Course));
    module.get<CategoriesService>(CategoriesService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a course successfully', async () => {
      const createDto = {
        title: 'Web Dev Bootcamp',
        price: 99.99,
        instructorId: 'inst-1',
        instructorName: 'John Doe',
        categoryId: 'cat-1',
      };
      const savedCourse = { id: '1', ...createDto, status: 'draft' };

      mockCategoriesService.findOne.mockResolvedValue({ id: 'cat-1' });
      mockRepository.create.mockReturnValue(savedCourse);
      mockRepository.save.mockResolvedValue(savedCourse);

      const result = await service.create(createDto);

      expect(result).toEqual(savedCourse);
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return paginated courses', async () => {
      const courses = [{ id: '1', title: 'Course 1' }];
      mockRepository.findAndCount.mockResolvedValue([courses, 1]);

      const result = await service.findAll(1, 10);

      expect(result.data).toEqual(courses);
      expect(result.total).toBe(1);
      expect(result.page).toBe(1);
      expect(result.limit).toBe(10);
    });
  });

  describe('findOne', () => {
    it('should return a course by id', async () => {
      const course = { id: '1', title: 'Course 1' };

      mockRepository.findOne.mockResolvedValue(course);

      const result = await service.findOne('1');

      expect(result).toEqual(course);
    });

    it('should throw NotFoundException if course not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateRating', () => {
    it('should update course rating successfully', async () => {
      const course = {
        id: '1',
        rating: 4.0,
        totalRatings: 5,
      };

      mockRepository.findOne.mockResolvedValue(course);
      mockRepository.save.mockResolvedValue({
        ...course,
        rating: 4.17,
        totalRatings: 6,
      });

      const result = await service.updateRating('1', 5);

      expect(result.totalRatings).toBe(6);
      expect(result.rating).toBeCloseTo(4.17, 2);
    });

    it('should throw BadRequestException for invalid rating', async () => {
      await expect(service.updateRating('1', 6)).rejects.toThrow(
        BadRequestException,
      );
    });
  });
});
