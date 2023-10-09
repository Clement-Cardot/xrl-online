import { TestBed } from '@angular/core/testing';

import { ApiReadinessLevelService } from './api-readiness-level.service';

describe('ApiReadinessLevelService', () => {
  let service: ApiReadinessLevelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiReadinessLevelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
