import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  it('/api/v1/categories (GET) should return empty array initially', () => {
    return request(app.getHttpServer())
      .get('/api/v1/categories')
      .expect(200)
      .expect((res) => {
        expect(Array.isArray(res.body)).toBe(true);
      });
  });

  it('/api/v1/courses (GET) should return paginated response', () => {
    return request(app.getHttpServer())
      .get('/api/v1/courses')
      .expect(200)
      .expect((res) => {
        expect(res.body).toHaveProperty('data');
        expect(res.body).toHaveProperty('total');
        expect(res.body).toHaveProperty('page');
        expect(res.body).toHaveProperty('limit');
      });
  });
});
