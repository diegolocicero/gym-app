import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Exercise } from './models/exercise';
import { FormsModule } from '@angular/forms';
import { ExerciseService } from './services/exercise';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './components/header/header';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FormsModule, CommonModule, HeaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  service = inject(ExerciseService);
  protected readonly title = signal('gym-app');
  editMode: boolean = false;
  exerciseToEdit: Exercise = new Exercise();
  exercises: Exercise[] = [];
  muscleGroups: string[] = [
  "Petto",
  "Dorso",
  "Spalle",
  "Bicipiti",
  "Tricipiti",
  "Gambe",
  "Glutei",
  "Addome",
  "Avambracci",
  "Polpacci"
];


  async ngOnInit() {
    this.exercises = this.service.getExerciseList() || [];
  }

  insertExercise() {
    this.editMode = true;
  }

  editExercise(exercise: Exercise) {
    this.editMode = true;
    this.exerciseToEdit = exercise;
  }

  deleteExercise(id: number) {
    console.log('Elimina esercizio con id:', id);
    const confirmed = confirm(`Sei sicuro di voler eliminare questo esercizio? 🗑️`);
    if (confirmed) {
      this.exercises = this.exercises.filter(ex => ex.id !== id);
      this.service.saveExerciseList(this.exercises);
      alert('Esercizio eliminato! ✅');
    }
  }

  saveExercise() {
    if (!this.exerciseToEdit.name || this.exerciseToEdit.name.trim() === '') {
      alert('Il nome dell\'esercizio è obbligatorio! ⚠️');
      return;
    }
    if (this.exerciseToEdit.id === 0) {
      this.exerciseToEdit.id = this.exercises.length + 1;
      this.exercises.push(this.exerciseToEdit);
    }
    this.service.saveExerciseList(this.exercises);
    console.log('Esercizio salvato:', this.exerciseToEdit);
    this.editMode = false;
    this.exerciseToEdit = new Exercise();
  }

  cancelEdit() {
    this.editMode = false;
    this.exerciseToEdit = new Exercise();
  }

}
