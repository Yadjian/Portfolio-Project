import { Test, TestingModule } from '@nestjs/testing';
import { SwipesController } from './swipes.controller';
import { SwipesService } from './swipes.service';

// Unit tests for the SwipesController
describe('SwipesController', () => {
  let controller: SwipesController;

  // Before each test, set up a testing module and instantiate the controller
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [SwipesController],
      providers: [
        {
          provide: SwipesService,
          useValue: {
            handleSwipe: jest.fn(),
            undoLastSwipe: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<SwipesController>(SwipesController);
  });

  // Test to ensure the controller is properly defined and instantiated
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
