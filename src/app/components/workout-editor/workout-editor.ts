import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-workout-editor',
  imports: [FormsModule, CommonModule],
  templateUrl: './workout-editor.html',
  styleUrls: ['./workout-editor.css']
})
export class WorkoutEditorComponent implements OnInit {

  toastr = inject(ToastrService);

  workoutName: string = '';
  exercises: any[] = [];
  selectedExercises: any[] = [];

  ngOnInit(): void {
    const stored = localStorage.getItem('exerciseList');

    if (stored) {
      try {
        this.exercises = JSON.parse(stored);
      } catch {
        console.error('exerciseList non è un JSON valido!');
        this.exercises = [];
        this.toastr.error('Errore nel caricamento degli esercizi');
      }
    }

    // Se non ci sono esercizi, crea demo
    if (!this.exercises || this.exercises.length === 0) {
      this.exercises = [
        { id: 1, name: 'Panca Piana', muscleGroup: 'Petto' },
        { id: 2, name: 'Squat', muscleGroup: 'Gambe' },
        { id: 3, name: 'Lat Machine', muscleGroup: 'Dorso' }
      ];
      localStorage.setItem('exerciseList', JSON.stringify(this.exercises));
      this.toastr.info('Esercizi di esempio caricati');
    }
  }

  toggleExercise(exercise: any): void {
    const index = this.selectedExercises.findIndex(e => e.id === exercise.id);
    if (index > -1) {
      this.selectedExercises.splice(index, 1);
    } else {
      this.selectedExercises.push(exercise);
    }
  }

  isSelected(exercise: any): boolean {
    return this.selectedExercises.some(e => e.id === exercise.id);
  }

  saveWorkout(): void {
    if (!this.workoutName.trim()) {
      this.toastr.warning('Inserisci un nome per la scheda');
      return;
    }

    if (this.selectedExercises.length === 0) {
      this.toastr.warning('Seleziona almeno un esercizio');
      return;
    }

    const workout = {
      id: Date.now(),
      name: this.workoutName,
      exercises: this.selectedExercises
    };

    const storedWorkouts = localStorage.getItem('workoutList');
    const workoutList = storedWorkouts ? JSON.parse(storedWorkouts) : [];

    workoutList.push(workout);
    localStorage.setItem('workoutList', JSON.stringify(workoutList));

    this.toastr.success('Scheda salvata correttamente');

    // Reset form
    this.workoutName = '';
    this.selectedExercises = [];
  }
}
