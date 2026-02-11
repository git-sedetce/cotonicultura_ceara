import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFarmesDropoutsComponent } from './list-farmes-dropouts.component';

describe('ListFarmesDropoutsComponent', () => {
  let component: ListFarmesDropoutsComponent;
  let fixture: ComponentFixture<ListFarmesDropoutsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListFarmesDropoutsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFarmesDropoutsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
