import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from './categories.service';
import { Category } from './category.entity';
import { NotFoundException, ConflictException } from '@nestjs/common';

describe('CategoriesService', () => {
  let service: CategoriesService;

  const mockRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CategoriesService,
        {
          provide: getRepositoryToken(Category),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<CategoriesService>(CategoriesService);
    module.get<Repository<Category>>(getRepositoryToken(Category));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a category successfully', async () => {
      const createDto = {
        name: 'Web Development',
        description: 'Web dev courses',
        isActive: true,
      };
      const savedCategory = { id: '1', ...createDto };

      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(savedCategory);
      mockRepository.save.mockResolvedValue(savedCategory);

      const result = await service.create(createDto);

      expect(result).toEqual(savedCategory);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { name: createDto.name },
      });
      expect(mockRepository.save).toHaveBeenCalled();
    });

    it('should throw ConflictException if category name exists', async () => {
      const createDto = {
        name: 'Web Development',
        description: 'Web dev courses',
      };
      const existingCategory = { id: '1', ...createDto };

      mockRepository.findOne.mockResolvedValue(existingCategory);

      await expect(service.create(createDto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('findAll', () => {
    it('should return active categories', async () => {
      const categories = [
        { id: '1', name: 'Web Dev', isActive: true },
        { id: '2', name: 'Mobile', isActive: true },
      ];

      mockRepository.find.mockResolvedValue(categories);

      const result = await service.findAll();

      expect(result).toEqual(categories);
      expect(mockRepository.find).toHaveBeenCalledWith({
        where: { isActive: true },
        order: { name: 'ASC' },
      });
    });
  });

  describe('findOne', () => {
    it('should return a category by id', async () => {
      const category = { id: '1', name: 'Web Dev', isActive: true };

      mockRepository.findOne.mockResolvedValue(category);

      const result = await service.findOne('1');

      expect(result).toEqual(category);
      expect(mockRepository.findOne).toHaveBeenCalledWith({
        where: { id: '1' },
        relations: ['courses'],
      });
    });

    it('should throw NotFoundException if category not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('1')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a category successfully', async () => {
      const category = { id: '1', name: 'Web Dev', isActive: true };
      const updateDto = { name: 'Updated Web Dev' };

      mockRepository.findOne
        .mockResolvedValueOnce(category) // First call in findOne
        .mockResolvedValueOnce(null); // Second call for name check
      mockRepository.save.mockResolvedValue({ ...category, ...updateDto });

      const result = await service.update('1', updateDto);

      expect(result).toEqual({ ...category, ...updateDto });
      expect(mockRepository.save).toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    it('should delete a category', async () => {
      const category = { id: '1', name: 'Web Dev' };

      mockRepository.findOne.mockResolvedValue(category);
      mockRepository.remove.mockResolvedValue(category);

      await service.remove('1');

      expect(mockRepository.remove).toHaveBeenCalledWith(category);
    });
  });
});
