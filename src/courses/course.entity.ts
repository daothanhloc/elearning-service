import {
  Entity,
  Column,
  PrimaryGeneratedColumn,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Category } from '../categories/category.entity';

@Entity('courses')
export class Course {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  title: string;

  @Column('text', { nullable: true })
  description: string;

  @Column('decimal', { precision: 10, scale: 2 })
  price: number;

  @Column('decimal', { precision: 3, scale: 2, default: 0 })
  rating: number;

  @Column({ default: 0 })
  totalRatings: number;

  @Column({ default: 0 })
  studentsEnrolled: number;

  @Column({ default: 0 })
  totalLessons: number;

  @Column({ default: 0 })
  totalDuration: number; // in minutes

  @Column({ nullable: true })
  instructorId: string;

  @Column({ nullable: true })
  instructorName: string;

  @Column({ nullable: true })
  thumbnailUrl: string;

  @Column({ nullable: true })
  previewVideoUrl: string;

  @Column('text', { array: true, default: [] })
  tags: string[];

  @Column({ default: 'draft' })
  status: string; // draft, published, archived

  @Column({ default: true })
  isPublished: boolean;

  @ManyToOne(() => Category, (category) => category.courses)
  @JoinColumn({ name: 'categoryId' })
  category: Category;

  @Column()
  categoryId: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
