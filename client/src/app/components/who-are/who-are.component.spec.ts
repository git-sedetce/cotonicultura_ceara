import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhoAreComponent } from './who-are.component';

describe('WhoAreComponent', () => {
  let component: WhoAreComponent;
  let fixture: ComponentFixture<WhoAreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [WhoAreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhoAreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
