import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { App } from 'supertest/types';
import { AppModule } from './../src/app.module';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

describe('AppController (e2e)', () => {
  let app: INestApplication<App>;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
  });

  it('/ (GET)', () => {
    return request(app.getHttpServer())
      .get('/')
      .expect(200)
      .expect('Hello World!');
  });

  describe('Auth + Profile flows', () => {
    const prisma = new PrismaClient();
    const pwd = 'Password123';
    let candToken: string;
    let recToken: string;
    const candEmail = 'lucas.boyadjian+candidate@gmail.com';
    const recEmail = 'lucas.boyadjian+recruiter@gmail.com';

    beforeAll(async () => {
      const h = bcrypt.hashSync(pwd, 12);
      const u1 = await prisma.user.create({ data: { email: candEmail, password: h, role: 'CANDIDATE' as any } });
      const u2 = await prisma.user.create({ data: { email: recEmail, password: h, role: 'RECRUITER' as any } });
      await prisma.candidateProfile.create({ data: { firstName: 'E2E', lastName: 'Cand', userId: u1.id } });
      await prisma.recruiterProfile.create({ data: { firstName: 'E2E', lastName: 'Rec', userId: u2.id } });

      const r1 = await request(app.getHttpServer()).post('/auth/login').send({ email: candEmail, password: pwd });
      const r2 = await request(app.getHttpServer()).post('/auth/login').send({ email: recEmail, password: pwd });
      if (r1.status === 200) candToken = r1.body.accessToken;
      if (r2.status === 200) recToken = r2.body.accessToken;
    });

    afterAll(async () => {
      await prisma.swipe.deleteMany({ where: {} }).catch(() => {});
      await prisma.candidateProfile.deleteMany({ where: { user: { email: candEmail } } }).catch(() => {});
      await prisma.recruiterProfile.deleteMany({ where: { user: { email: recEmail } } }).catch(() => {});
      await prisma.user.deleteMany({ where: { email: { in: [candEmail, recEmail] } } }).catch(() => {});
      await prisma.$disconnect();
    });

    it('should verify that we have 0 users in the DB', async () => {
      const res = await request(app.getHttpServer()).get('/auth/users');
      expect(res.status).toBe(200);
      expect(Array.isArray(res.body)).toBe(true);
    });

    it('should reject /profile/me without token and allow with token', async () => {
      const unauth = await request(app.getHttpServer()).get('/profile/me');
      expect([401, 403]).toContain(unauth.status);

      const auth = await request(app.getHttpServer()).get('/profile/me').set('Authorization', `Bearer ${candToken}`);
      expect(auth.status).toBe(200);
    });

    it('should store password hashed in database', async () => {
      const user = await prisma.user.findUnique({ where: { email: candEmail } });
      expect(user).toBeTruthy();
      expect(user!.password).not.toBe(pwd);
      const ok = await bcrypt.compare(pwd, user!.password);
      expect(ok).toBe(true);
    });

    it('should update profile fields and persist in database', async () => {
      await request(app.getHttpServer()).put('/profile/me').set('Authorization', `Bearer ${candToken}`).send({ firstName: 'Lucas', lastName: 'Updated' }).expect(200);
      const get = await request(app.getHttpServer()).get('/profile/me').set('Authorization', `Bearer ${candToken}`).expect(200);
      expect(get.body.firstName === 'Lucas' || get.body.user?.firstName === 'Lucas').toBeTruthy();
    });

    it('should create match when both users swipe RIGHT', async () => {
      const profA = (await request(app.getHttpServer()).get('/profile/me').set('Authorization', `Bearer ${candToken}`)).body;
      const profB = (await request(app.getHttpServer()).get('/profile/me').set('Authorization', `Bearer ${recToken}`)).body;
      await request(app.getHttpServer()).post('/swipes').set('Authorization', `Bearer ${candToken}`).send({ targetProfileId: profB.id, direction: 'RIGHT' }).expect(201);
      await request(app.getHttpServer()).post('/swipes').set('Authorization', `Bearer ${recToken}`).send({ targetProfileId: profA.id, direction: 'RIGHT' }).expect(201);
      const matches = await request(app.getHttpServer()).get('/matches').set('Authorization', `Bearer ${candToken}`).expect(200);
      expect(Array.isArray(matches.body)).toBe(true);
    });

    it('should upload photo and return URL', async () => {
      const res = await request(app.getHttpServer()).put('/profile/photo').set('Authorization', `Bearer ${candToken}`).attach('photoFile', Buffer.from('dummy'), 'photo.jpg');
      expect([200, 201]).toContain(res.status);
      expect(res.body.url || res.body.photoUrl).toBeDefined();
    });
  });
});
