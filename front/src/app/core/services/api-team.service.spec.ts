import { TestBed } from '@angular/core/testing';

import { ApiTeamService } from './api-team.service';

describe('ApiTeamService', () => {
  let service: ApiTeamService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiTeamService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
