import { Test, TestingModule } from '@nestjs/testing';
import { MatchesService } from './matches.service';

// Unit tests for the MatchesService
describe('MatchesService', () => {
  let service: MatchesService;

  // Before each test, set up a testing module and instantiate the service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MatchesService],
    }).compile();

    service = module.get<MatchesService>(MatchesService);
  });

  // Test to ensure the service is properly defined and instantiated
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
