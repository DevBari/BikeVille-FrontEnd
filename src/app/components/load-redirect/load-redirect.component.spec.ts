import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadRedirectComponent } from './load-redirect.component';

describe('LoadRedirectComponent', () => {
  let component: LoadRedirectComponent;
  let fixture: ComponentFixture<LoadRedirectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoadRedirectComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LoadRedirectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
