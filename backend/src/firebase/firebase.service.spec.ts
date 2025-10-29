import { Test, TestingModule } from '@nestjs/testing';
import { FirebaseService } from './firebase.service';

// Unit tests for the FirebaseService
describe('FirebaseService', () => {
  let service: FirebaseService;

  // Before each test, set up a testing module and instantiate the service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FirebaseService],
    }).compile();

    service = module.get<FirebaseService>(FirebaseService);
  });

  // Test to ensure the service is properly defined and instantiated
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
