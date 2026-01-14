import { Injectable } from '@angular/core';
import { Exercise } from '../models/exercise';

@Injectable({
  providedIn: 'root',
})
export class ExerciseService {
  private readonly storageKey = 'exerciseList';

  /** Salva la lista completa di esercizi su localStorage */
  saveExerciseList(exercises: Exercise[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(exercises));
    } catch (e) {
      console.error('Errore nel salvataggio degli esercizi:', e);
    }
  }

  /** Recupera la lista di esercizi dal localStorage */
  getExerciseList(): Exercise[] {
    const data = localStorage.getItem(this.storageKey);
    if (!data) return [];
    try {
      return JSON.parse(data) as Exercise[];
    } catch (e) {
      console.error('Errore nel parsing degli esercizi da localStorage:', e);
      return [];
    }
  }

  /** Aggiunge un nuovo esercizio alla lista e lo salva */
  addExercise(exercise: Exercise): void {
    const exercises = this.getExerciseList();
    exercises.push(exercise);
    this.saveExerciseList(exercises);
  }

  /** Elimina un esercizio per id e aggiorna il localStorage */
  deleteExercise(id: number): void {
    const exercises = this.getExerciseList().filter(e => e.id !== id);
    this.saveExerciseList(exercises);
  }

  /** Aggiorna un esercizio esistente (basato su id) */
  updateExercise(updated: Exercise): void {
    const exercises = this.getExerciseList().map(e =>
      e.id === updated.id ? updated : e
    );
    this.saveExerciseList(exercises);
  }
}
