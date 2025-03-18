import { TestBed } from '@angular/core/testing';

import { UploadimagesService } from './uploadimages.service';

describe('UploadimagesService', () => {
  let service: UploadimagesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UploadimagesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
