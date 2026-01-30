import { Test, TestingModule } from '@nestjs/testing';
import { SwipesController } from './swipes.controller';

// Unit tests for the SwipesController
describe('SwipesController', () => {
  let controller: SwipesController;

  // Before each test, set up a testing module and instantiate the controller
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwipesController],
    }).compile();

    controller = module.get<SwipesController>(SwipesController);
  });

  // Test to ensure the controller is properly defined and instantiated
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
