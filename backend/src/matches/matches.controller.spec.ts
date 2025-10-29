import { Test, TestingModule } from '@nestjs/testing';
import { MatchesController } from './matches.controller';

// Unit tests for the MatchesController
describe('MatchesController', () => {
  let controller: MatchesController;

  // Before each test, set up a testing module and instantiate the controller
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MatchesController],
    }).compile();

    controller = module.get<MatchesController>(MatchesController);
  });

  // Test to ensure the controller is properly defined and instantiated
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
