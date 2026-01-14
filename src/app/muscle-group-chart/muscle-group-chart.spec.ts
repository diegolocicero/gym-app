import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MuscleGroupChart } from './muscle-group-chart';

describe('MuscleGroupChart', () => {
  let component: MuscleGroupChart;
  let fixture: ComponentFixture<MuscleGroupChart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MuscleGroupChart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MuscleGroupChart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
