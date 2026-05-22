import { Test, TestingModule } from '@nestjs/testing';
import { SwipesService } from './swipes.service';
import { PrismaService } from '../prisma/prisma.service';
import { getQueueToken } from '@nestjs/bullmq';
import {
  MATCH_NOTIFICATION_QUEUE,
  SWIPE_NOTIFICATION_QUEUE,
} from '../notifications/notifications.module';

// Unit tests for the SwipesService
describe('SwipesService', () => {
  let service: SwipesService;

  // Before each test, set up a testing module and instantiate the service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SwipesService,
        {
          provide: PrismaService,
          useValue: {},
        },
        {
          provide: getQueueToken(SWIPE_NOTIFICATION_QUEUE),
          useValue: { add: jest.fn() },
        },
        {
          provide: getQueueToken(MATCH_NOTIFICATION_QUEUE),
          useValue: { add: jest.fn() },
        },
      ],
    }).compile();

    service = module.get<SwipesService>(SwipesService);
  });

  // Test to ensure the service is properly defined and instantiated
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
