import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ResetSexhaComponent } from './reset-sexha.component';

describe('ResetSexhaComponent', () => {
  let component: ResetSexhaComponent;
  let fixture: ComponentFixture<ResetSexhaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ResetSexhaComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ResetSexhaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
