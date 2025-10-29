import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryService } from './discovery.service';

// Unit tests for the DiscoveryService
describe('DiscoveryService', () => {
  let service: DiscoveryService;

  // Before each test, set up a testing module and instantiate the service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DiscoveryService],
    }).compile();

    service = module.get<DiscoveryService>(DiscoveryService);
  });

  // Test to ensure the service is properly defined and instantiated
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
