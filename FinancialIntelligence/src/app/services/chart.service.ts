import { Injectable } from '@angular/core';
import { Transaction } from '../models/transaction.model';
import { startOfWeek, endOfWeek, startOfDay, endOfDay } from 'date-fns';
import { fr } from 'date-fns/locale';

@Injectable({
  providedIn: 'root'
})
export class ChartService {
  // Génère les données pour le graphique hebdomadaire
  getWeeklyData(transactions: Transaction[], selectedDate: Date = new Date()) {
    // Définit la période de la semaine
    const start = startOfWeek(selectedDate, { locale: fr });
    const end = endOfWeek(selectedDate, { locale: fr });
    
    // Filtre les transactions de la semaine
    const weekTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= start && date <= end;
    });

    // Structure pour accumuler les montants par type
    const data = {
      income: 0,
      expense: 0,
      credit: 0,
      loan: 0,
      savings: 0
    };

    // Calcule les totaux par type
    weekTransactions.forEach(t => {
      switch (t.type) {
        case 'INCOME': data.income += t.amount; break;
        case 'EXPENSE': data.expense += t.amount; break;
        case 'CREDIT': data.credit += t.amount; break;
        case 'LOAN': data.loan += t.amount; break;
        case 'SAVINGS': data.savings += t.amount; break;
      }
    });

    // Retourne les données formatées pour le graphique
    return {
      labels: ['Entrées', 'Sorties', 'Crédits', 'Prêts', 'Épargne'],
      datasets: [{
        data: [data.income, data.expense, data.credit, data.loan, data.savings],
        backgroundColor: [
          '#2dd36f', // success - vert
          '#eb445a', // danger - rouge
          '#3880ff', // primary - bleu
          '#ffc409', // warning - orange
          '#5260ff'  // tertiary - violet
        ]
      }]
    };
  }

  // Génère les données pour le graphique journalier
  getDailyData(transactions: Transaction[], selectedDate: Date = new Date()) {
    // Définit la période de la journée
    const start = startOfDay(selectedDate);
    const end = endOfDay(selectedDate);
    
    // Filtre les transactions du jour
    const dayTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date >= start && date <= end;
    });

    // Initialise les données par heure
    const hourlyData = Array(24).fill(0).map(() => ({
      income: 0,
      expense: 0,
      credit: 0,
      loan: 0,
      savings: 0
    }));

    // Répartit les transactions par heure
    dayTransactions.forEach(t => {
      const hour = new Date(t.date).getHours();
      switch (t.type) {
        case 'INCOME': hourlyData[hour].income += t.amount; break;
        case 'EXPENSE': hourlyData[hour].expense += t.amount; break;
        case 'CREDIT': hourlyData[hour].credit += t.amount; break;
        case 'LOAN': hourlyData[hour].loan += t.amount; break;
        case 'SAVINGS': hourlyData[hour].savings += t.amount; break;
      }
    });

    // Retourne les données formatées pour le graphique linéaire
    return {
      labels: Array(24).fill(0).map((_, i) => `${i}h`),
      datasets: [
        {
          label: 'Entrées',
          data: hourlyData.map(d => d.income),
          borderColor: '#2dd36f',
          fill: false
        },
        {
          label: 'Sorties',
          data: hourlyData.map(d => d.expense),
          borderColor: '#eb445a',
          fill: false
        },
        {
          label: 'Crédits',
          data: hourlyData.map(d => d.credit),
          borderColor: '#3880ff',
          fill: false
        },
        {
          label: 'Prêts',
          data: hourlyData.map(d => d.loan),
          borderColor: '#ffc409',
          fill: false
        },
        {
          label: 'Épargne',
          data: hourlyData.map(d => d.savings),
          borderColor: '#5260ff',
          fill: false
        }
      ]
    };
  }
}