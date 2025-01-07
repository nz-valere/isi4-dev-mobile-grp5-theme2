export type ExpenseLevel = 'Low' | 'Medium' | 'Important';

export interface ExpenseAnalysis {
  level: ExpenseLevel;
  percentage: number;
  recommendations: string[];
}