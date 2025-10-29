import { Test, TestingModule } from '@nestjs/testing';
import { DiscoveryController } from './discovery.controller';

// Unit tests for the DiscoveryController
describe('DiscoveryController', () => {
  let controller: DiscoveryController;

  // Before each test, set up a testing module and instantiate the controller
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DiscoveryController],
    }).compile();

    controller = module.get<DiscoveryController>(DiscoveryController);
  });

  // Test to ensure the controller is properly defined and instantiated
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
