import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkoutEditor } from './workout-editor';

describe('WorkoutEditor', () => {
  let component: WorkoutEditor;
  let fixture: ComponentFixture<WorkoutEditor>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkoutEditor]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkoutEditor);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
