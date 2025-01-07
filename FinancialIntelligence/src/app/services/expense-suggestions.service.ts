import { Injectable } from '@angular/core';
import { ExpenseLevel } from '../models/expense-level.model';

@Injectable({
  providedIn: 'root'
})
export class ExpenseSuggestionsService {
  getSuggestions(level: ExpenseLevel): string[] {
    switch (level) {
      case 'Low':
        return [
          'Excellent contrôle des dépenses ! Voici quelques suggestions :',
          '• Envisagez d\'investir l\'excédent dans des placements long terme',
          '• Augmentez votre épargne de précaution pour les imprévus',
          '• Pensez à diversifier vos sources de revenus'
        ];

      case 'Medium':
        return [
          'Votre niveau de dépenses est à surveiller :',
          '• Établissez un budget mensuel détaillé',
          '• Identifiez les dépenses récurrentes compressibles',
          '• Privilégiez les achats essentiels',
          '• Évitez les dépenses impulsives'
        ];

      case 'Important':
        return [
          'Attention, vos dépenses nécessitent une action immédiate :',
          '• Réduisez drastiquement les dépenses non essentielles',
          '• Reportez les achats importants non urgents',
          '• Négociez vos abonnements et services récurrents',
          '• Évitez tout nouveau crédit',
          '• Consultez un conseiller financier si nécessaire'
        ];

      default:
        return ['Analysez régulièrement vos dépenses pour maintenir une bonne santé financière.'];
    }
  }
}