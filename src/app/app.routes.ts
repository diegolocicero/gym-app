import { Routes } from '@angular/router';
import { ExerciseList } from './components/exerciseList/exerciseList';
import { WorkoutDashboardComponent } from './components/workout-dashboard/workout-dashboard';
import { WorkoutEditorComponent } from './components/workout-editor/workout-editor';
import { MuscleGroupChartComponent } from './muscle-group-chart/muscle-group-chart';

export const routes: Routes = [
  { path: '', redirectTo: 'exercises', pathMatch: 'full' },
  { path: 'exercises', component: ExerciseList },
  { path: 'workout-editor', component: WorkoutEditorComponent },
  { path: 'workout-dashboard', component: WorkoutDashboardComponent },
  { path: 'muscle-group-chart', component: MuscleGroupChartComponent }
];
