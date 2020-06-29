import { TestBed } from '@angular/core/testing';

import { PrestoService } from './presto.service';

describe('PrestoService', () => {
  let service: PrestoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PrestoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
