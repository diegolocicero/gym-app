import { Component, inject } from '@angular/core';
import { Exercise } from '../../models/exercise';
import { FormsModule } from '@angular/forms';
import { ExerciseService } from '../../services/exercise';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-exercise-list',
  standalone: true, 
  imports: [FormsModule, CommonModule],
  templateUrl: './exerciseList.html',
  styleUrls: ['./exerciseList.css'],
  animations: [
    trigger('modalAnimation', [
      transition(':enter', [
        style({ transform: 'translateY(-100%)', opacity: 0 }),
        animate('300ms ease-out', style({ transform: 'translateY(0)', opacity: 1 }))
      ]),
      transition(':leave', [
        animate('300ms ease-in', style({ transform: 'translateY(-100%)', opacity: 0 }))
      ])
    ])
  ]
})
export class ExerciseList {
  service = inject(ExerciseService);
  toastr = inject(ToastrService);

  editMode: boolean = false;
  exerciseToEdit: Exercise = new Exercise();
  exercises: Exercise[] = [];

  muscleGroups: string[] = [
    "Petto","Dorso","Spalle","Bicipiti","Tricipiti","Gambe",
    "Glutei","Addome","Avambracci","Polpacci"
  ];

  showConfirmModal: boolean = false;
  exerciseToDeleteId: number | null = null;

  ngOnInit() {
    const stored = this.service.getExerciseList();
    this.exercises = stored || [];
  }

  insertExercise() {
    this.editMode = true;
    this.exerciseToEdit = new Exercise();
  }

  editExercise(exercise: Exercise) {
    this.editMode = true;
    this.exerciseToEdit = { ...exercise };
  }

  saveExercise() {
    if (!this.exerciseToEdit.name?.trim()) {
      this.toastr.warning("Il nome dell'esercizio è obbligatorio");
      return;
    }

    if (this.exerciseToEdit.id === 0) {
      this.exerciseToEdit.id = Date.now();
      this.exercises.push({ ...this.exerciseToEdit });
    } 
    else {
      const index = this.exercises.findIndex(ex => ex.id === this.exerciseToEdit.id);
      if (index > -1) this.exercises[index] = { ...this.exerciseToEdit };
    }

    this.service.saveExerciseList(this.exercises);
    this.toastr.success('Esercizio salvato correttamente');
    this.cancelEdit();
  }

  cancelEdit() {
    this.editMode = false;
    this.exerciseToEdit = new Exercise();
  }

  confirmDeleteExercise(id: number) {
    this.exerciseToDeleteId = id;
    this.showConfirmModal = true;
  }

  deleteExerciseConfirmed() {
    if (this.exerciseToDeleteId !== null) {
      this.exercises = this.exercises.filter(ex => ex.id !== this.exerciseToDeleteId);
      this.service.saveExerciseList(this.exercises);
      this.toastr.success('Esercizio eliminato con successo');
    }
    this.cancelDelete();
  }

  cancelDelete() {
    this.showConfirmModal = false;
    this.exerciseToDeleteId = null;
  }
}
