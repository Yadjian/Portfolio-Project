import { Test, TestingModule } from '@nestjs/testing';
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid'),
}));
import { FileStorageService } from './file-storage.service';

// Unit tests for the FileStorageService
describe('FileStorageService', () => {
  let service: FileStorageService;

  // Before each test, set up a testing module and instantiate the service
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FileStorageService],
    }).compile();

    service = module.get<FileStorageService>(FileStorageService);
  });

  // Test to ensure the service is properly defined and instantiated
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
