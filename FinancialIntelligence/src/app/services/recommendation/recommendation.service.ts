import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RecommendationService {
  getMonthlyRecommendation(expenses: number): string {
    if (expenses <= 30) return 'Low: Great job managing expenses!';
    if (expenses <= 60) return 'Medium: Keep an eye on your spending!';
    return 'Important: Consider cutting back!';
  }
  constructor() { }
}
