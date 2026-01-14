import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-workout-dashboard',
  imports: [FormsModule, CommonModule],
  templateUrl: './workout-dashboard.html',
  styleUrls: ['./workout-dashboard.css']
})
export class WorkoutDashboardComponent implements OnInit {

  workouts: any[] = [];

  ngOnInit(): void {
    const stored = localStorage.getItem('workoutList');
    this.workouts = stored ? JSON.parse(stored) : [];
  }

  deleteWorkout(id: number): void {
    if (!confirm('Sei sicuro di voler eliminare questa scheda?')) return;
    this.workouts = this.workouts.filter(w => w.id !== id);
    localStorage.setItem('workoutList', JSON.stringify(this.workouts));
  }
}
