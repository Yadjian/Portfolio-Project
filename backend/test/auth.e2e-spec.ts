import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AuthModule } from '../src/auth/auth.module';
import { PrismaClient } from '@prisma/client';

describe('Auth E2E (Real DB)', () => {
  let app: INestApplication;
  const prisma = new PrismaClient();
  const testEmail = 'lucas.boyadjian@gmail.com';
  const testPassword = 'Password123';
  let accessToken: string;

  beforeAll(async () => {
    // Clean DB before tests: TRUNCATE CASCADE removes dependent rows as well
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE;').catch(() => {});

    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AuthModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('should verify that we have 0 users in the DB before tests', async () => {
    const count = await prisma.user.count();
    expect(count).toBe(0);
  });

  it('should sign up a new user and return tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: testPassword, role: 'CANDIDATE' });

    expect(res.status).toBe(201);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
  });

  it('should verify the user exists in the DB after signup', async () => {
    const user = await prisma.user.findUnique({ where: { email: testEmail } });
    expect(user).not.toBeNull();
    expect(user.email).toBe(testEmail);
  });

  it('should reject duplicate signup', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/signup')
      .send({ email: testEmail, password: testPassword, role: 'CANDIDATE' });

    expect(res.status).toBe(409);
  });

  it('should login and return tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: testEmail, password: testPassword });

    expect(res.status).toBe(200);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.refreshToken).toBeDefined();
    accessToken = res.body.accessToken;
  });

  it('should access protected route (logout) with token', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/logout')
      .set('Authorization', `Bearer ${accessToken}`)
      .send();

    expect(res.status).toBe(200);
  });

  afterAll(async () => {
    // Clean DB after tests: TRUNCATE CASCADE removes dependent rows as well
    await prisma.$executeRawUnsafe('TRUNCATE TABLE "User" CASCADE;').catch(() => {});
    await prisma.$disconnect();
    await app.close();
  });
});
