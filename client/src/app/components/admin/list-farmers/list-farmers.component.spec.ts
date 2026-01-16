import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListFarmersComponent } from './list-farmers.component';

describe('ListFarmersComponent', () => {
  let component: ListFarmersComponent;
  let fixture: ComponentFixture<ListFarmersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ListFarmersComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListFarmersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
