import { TestBed } from '@angular/core/testing';

import { ScrollToDownService } from './scroll-to-down.service';

describe('ScrollToDownService', () => {
  let service: ScrollToDownService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ScrollToDownService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
