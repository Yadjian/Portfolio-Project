import { Test, TestingModule } from '@nestjs/testing';
import { SwipesService } from './swipes.service';

// Unit tests for the SwipesService
describe('SwipesService', () => {
  let service: SwipesService;

  // Before each test, set up a testing module and instantiate the service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SwipesService],
    }).compile();

    service = module.get<SwipesService>(SwipesService);
  });

  // Test to ensure the service is properly defined and instantiated
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
