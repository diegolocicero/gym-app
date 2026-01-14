import { Component, Input, OnChanges, SimpleChanges, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface ChartData {
  name: string;
  value: number;
  percentage: number;
  color: string;
  pathData: string;
  labelX: number;
  labelY: number;
}

@Component({
  selector: 'app-muscle-group-chart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './muscle-group-chart.html',
  styleUrls: ['./muscle-group-chart.css']
})
export class MuscleGroupChartComponent implements OnInit, OnChanges {
  @Input() exercises: any[] = [];

  // Dati per il grafico
  chartData: ChartData[] = [];
  
  // Colori predefiniti
  private colorPalette = [
    '#FFAAB8', '#980404', '#DE802B', '#3B4953', '#10b981',
    '#047857', '#34d399', '#059669', '#0d9488', '#115e59',
    '#134e4a', '#042f2e'
  ];

  // Dimensioni SVG
  svgSize = 400;
  center = this.svgSize / 2;
  radius = 150;
  innerRadius = 100; // Per grafico a ciambella
  
  // Tipo di grafico
  isDoughnut = false;
  
  // Statistiche
  totalExercises = 0;
  uniqueMuscleGroups = 0;
  mostTrainedMuscle = '';
  mostTrainedCount = 0;
  
  // Data corrente
  currentDate = new Date();

  ngOnInit(): void {
    if (!this.exercises || this.exercises.length === 0) {
      this.loadExercisesFromLocalStorage();
    }
    this.updateChart();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['exercises']) {
      console.log('Exercises changed:', this.exercises);
      this.updateChart();
    }
  }

  private loadExercisesFromLocalStorage(): void {
    try {
      const storedExercises = localStorage.getItem('exerciseList');
      if (storedExercises) {
        this.exercises = JSON.parse(storedExercises);
        console.log('Loaded exercises from localStorage:', this.exercises);
      } else {
        console.log('No exercises found in localStorage');
        this.exercises = [];
      }
    } catch (error) {
      console.error('Error loading exercises from localStorage:', error);
      this.exercises = [];
    }
  }

  private updateChart(): void {
    console.log('Updating chart with exercises:', this.exercises);
    
    // Se ancora non ci sono esercizi, prova a caricarli
    if (!this.exercises || this.exercises.length === 0) {
      this.loadExercisesFromLocalStorage();
    }
    
    // Calcola statistiche
    this.totalExercises = this.exercises?.length || 0;
    console.log('Total exercises:', this.totalExercises);
    
    // Conta gruppi muscolari unici
    const counts: { [key: string]: number } = {};
    
    if (this.exercises && this.exercises.length > 0) {
      this.exercises.forEach(ex => {
        if (ex && ex.muscleGroup) {
          const muscleGroup = String(ex.muscleGroup).trim();
          if (muscleGroup && muscleGroup !== 'undefined' && muscleGroup !== 'null') {
            counts[muscleGroup] = (counts[muscleGroup] || 0) + 1;
          }
        }
      });
    }
    
    console.log('Muscle group counts:', counts);
    this.uniqueMuscleGroups = Object.keys(counts).length;
    
    // Se non ci sono dati validi, resetta tutto
    if (this.uniqueMuscleGroups === 0) {
      this.chartData = [];
      this.mostTrainedMuscle = '';
      this.mostTrainedCount = 0;
      return;
    }
    
    // Prepara dati per il grafico
    const total = Object.values(counts).reduce((sum, val) => sum + val, 0);
    
    // Trova il muscolo più allenato
    let maxCount = 0;
    let maxMuscle = '';
    
    const sortedData = Object.entries(counts)
      .map(([name, value], index) => {
        const percentage = total > 0 ? (value / total) * 100 : 0;
        
        if (value > maxCount) {
          maxCount = value;
          maxMuscle = this.formatMuscleGroupName(name);
        }
        
        return {
          originalName: name,
          name: this.formatMuscleGroupName(name),
          value,
          percentage,
          color: this.colorPalette[index % this.colorPalette.length],
          index
        };
      })
      .sort((a, b) => b.value - a.value);
    
    this.mostTrainedMuscle = maxMuscle;
    this.mostTrainedCount = maxCount;
    
    // Calcola angoli e percorsi SVG
    this.chartData = this.calculateSvgPaths(sortedData, total);
    console.log('Chart data generated:', this.chartData);
  }

  private calculateSvgPaths(data: any[], total: number): ChartData[] {
    let currentAngle = 0;
    const fullCircle = 2 * Math.PI;
    
    return data.map(item => {
      const angle = (item.value / total) * fullCircle;
      const startAngle = currentAngle;
      const endAngle = currentAngle + angle;
      
      // Calcola i punti per l'arco SVG
      const startX = this.center + this.radius * Math.cos(startAngle);
      const startY = this.center + this.radius * Math.sin(startAngle);
      const endX = this.center + this.radius * Math.cos(endAngle);
      const endY = this.center + this.radius * Math.sin(endAngle);
      
      // Per grafico a ciambella
      const innerStartX = this.center + this.innerRadius * Math.cos(startAngle);
      const innerStartY = this.center + this.innerRadius * Math.sin(startAngle);
      const innerEndX = this.center + this.innerRadius * Math.cos(endAngle);
      const innerEndY = this.center + this.innerRadius * Math.sin(endAngle);
      
      // Crea il percorso SVG
      const largeArc = angle > Math.PI ? 1 : 0;
      
      let pathData = '';
      if (this.isDoughnut) {
        // Percorso per ciambella
        pathData = `
          M ${innerStartX} ${innerStartY}
          L ${startX} ${startY}
          A ${this.radius} ${this.radius} 0 ${largeArc} 1 ${endX} ${endY}
          L ${innerEndX} ${innerEndY}
          A ${this.innerRadius} ${this.innerRadius} 0 ${largeArc} 0 ${innerStartX} ${innerStartY}
          Z
        `;
      } else {
        // Percorso per torta semplice
        pathData = `
          M ${this.center} ${this.center}
          L ${startX} ${startY}
          A ${this.radius} ${this.radius} 0 ${largeArc} 1 ${endX} ${endY}
          Z
        `;
      }
      
      // Calcola posizione per l'etichetta
      const midAngle = startAngle + angle / 2;
      const labelRadius = this.isDoughnut ? (this.radius + this.innerRadius) / 2 : this.radius * 0.7;
      const labelX = this.center + labelRadius * Math.cos(midAngle);
      const labelY = this.center + labelRadius * Math.sin(midAngle);
      
      currentAngle = endAngle;
      
      return {
        name: item.name,
        value: item.value,
        percentage: Math.round(item.percentage),
        color: item.color,
        angle: angle,
        startAngle: startAngle,
        endAngle: endAngle,
        largeArc: largeArc === 1,
        pathData: pathData.replace(/\s+/g, ' ').trim(),
        labelX: labelX,
        labelY: labelY
      };
    });
  }

  private formatMuscleGroupName(name: string): string {
    return name
      .split(/[_\s]+/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ') || name;
  }

  // Metodi pubblici
  getPercentage(value: number): number {
    if (this.totalExercises === 0) return 0;
    return Math.round((value / this.totalExercises) * 100);
  }

  getColorIndex(index: number): number {
    return index % this.colorPalette.length;
  }

  get hasData(): boolean {
    return this.chartData.length > 0;
  }

  // Metodo per forzare l'aggiornamento
  refreshChart(): void {
    this.loadExercisesFromLocalStorage();
    this.updateChart();
  }

  // Cambia tipo di grafico
  toggleChartType(): void {
    this.isDoughnut = !this.isDoughnut;
    if (this.hasData) {
      const total = this.chartData.reduce((sum, item) => sum + item.value, 0);
      const data = this.chartData.map(item => ({
        name: item.name,
        value: item.value,
        percentage: item.percentage,
        originalName: item.name,
        color: item.color
      }));
      this.chartData = this.calculateSvgPaths(data, total);
    }
  }

  // Debug: stampa gli esercizi in console
  debugExercises(): void {
    console.log('Current exercises:', this.exercises);
    console.log('LocalStorage exercises:', localStorage.getItem('exercises'));
  }
}