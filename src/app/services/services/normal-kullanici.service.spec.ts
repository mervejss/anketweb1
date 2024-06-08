import { TestBed } from '@angular/core/testing';

import { NormalKullaniciService } from './normal-kullanici.service';

describe('NormalKullaniciService', () => {
  let service: NormalKullaniciService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NormalKullaniciService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
