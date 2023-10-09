import { TestBed } from '@angular/core/testing';

import { ApiBusinessLineService } from './api-business-line.service';

describe('ApiBusinessLineService', () => {
  let service: ApiBusinessLineService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiBusinessLineService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
