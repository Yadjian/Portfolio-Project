import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryController } from './discovery.controller';
import { DiscoveryService } from './discovery.service';

// Unit tests for the DiscoveryController
describe('DiscoveryController', () => {
  let controller: DiscoveryController;

  // Before each test, set up a testing module and instantiate the controller
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscoveryController],
      providers: [
        {
          provide: DiscoveryService,
          useValue: {
            getRecruitersForCandidate: jest.fn(),
            getCandidatesForRecruiter: jest.fn(),
            getPendingCandidatesForRecruiter: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<DiscoveryController>(DiscoveryController);
  });

  // Test to ensure the controller is properly defined and instantiated
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
