import { TestBed } from '@angular/core/testing';

import { AresFormService } from './ares-form.service';

describe('AresFormService', () => {
  let service: AresFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AresFormService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
